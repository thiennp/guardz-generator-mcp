import assert from 'node:assert/strict';
import { mkdtemp, readFile, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import test from 'node:test';
import { fileURLToPath } from 'node:url';

import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { InMemoryTransport } from '@modelcontextprotocol/sdk/inMemory.js';

import { createGuardzServer } from '../src/presentation/create-server.js';

const fixtures = path.join(path.dirname(fileURLToPath(import.meta.url)), 'fixtures');

async function connectClient(): Promise<Client> {
  const server = createGuardzServer('2.0.0');
  const [clientTransport, serverTransport] = InMemoryTransport.createLinkedPair();
  await server.connect(serverTransport);
  const client = new Client({ name: 'guardz-test', version: '2.0.0' });
  await client.connect(clientTransport);
  return client;
}

test('lists the four guard tools and the add-runtime-guard prompt', async () => {
  const client = await connectClient();
  const tools = await client.listTools();
  const names = tools.tools.map(tool => tool.name).sort();
  assert.deepEqual(names, [
    'apply_type_guards',
    'audit_type_guards',
    'explain_type',
    'preview_type_guard',
  ]);

  const prompt = await client.getPrompt({
    name: 'add-runtime-guard',
    arguments: { typeName: 'User' },
  });
  const text = prompt.messages[0]?.content;
  assert.equal(text?.type, 'text');
  if (text?.type === 'text') {
    assert.match(text.text, /preview_type_guard/);
    assert.match(text.text, /User/);
  }
  await client.close();
});

test('preview_type_guard returns source and does not write a file', async () => {
  const client = await connectClient();
  const source = path.join(fixtures, 'primitives.ts');
  const result = await client.callTool({
    name: 'preview_type_guard',
    arguments: { files: [source], typeName: 'User' },
  });
  assert.equal(result.isError, undefined);
  const text = textOf(result);
  assert.match(text, /isUser/);
  await assert.rejects(readFile(path.join(fixtures, 'isUser.guardz.ts')));
  await client.close();
});

test('apply_type_guards writes the guard file', async () => {
  const directory = await mkdtemp(path.join(tmpdir(), 'guardz-mcp-'));
  const source = path.join(directory, 'primitives.ts');
  await writeFile(source, await readFile(path.join(fixtures, 'primitives.ts')));
  const client = await connectClient();
  const result = await client.callTool({
    name: 'apply_type_guards',
    arguments: { files: [source], typeName: 'User' },
  });
  assert.notEqual(result.isError, true);
  const written = await readFile(path.join(directory, 'isUser.guardz.ts'), 'utf8');
  assert.match(written, /isUser/);
  await client.close();
  await rm(directory, { recursive: true, force: true });
});

test('audit_type_guards reports a missing guard', async () => {
  const client = await connectClient();
  const result = await client.callTool({
    name: 'audit_type_guards',
    arguments: { files: [path.join(fixtures, 'optional.ts')] },
  });
  assert.notEqual(result.isError, true);
  assert.match(textOf(result), /"status": "missing"/);
  await client.close();
});

test('explain_type returns limitations for any', async () => {
  const client = await connectClient();
  const result = await client.callTool({
    name: 'explain_type',
    arguments: { files: [path.join(fixtures, 'limits.ts')], typeName: 'Bag' },
  });
  assert.notEqual(result.isError, true);
  assert.match(textOf(result), /any/);
  await client.close();
});

test('unknown type returns an error result', async () => {
  const client = await connectClient();
  const result = await client.callTool({
    name: 'preview_type_guard',
    arguments: { files: [path.join(fixtures, 'primitives.ts')], typeName: 'Missing' },
  });
  assert.equal(result.isError, true);
  assert.match(textOf(result), /not found/);
  await client.close();
});

function textOf(result: { content: unknown }): string {
  const content = result.content;
  if (!Array.isArray(content) || content[0]?.type !== 'text') {
    return '';
  }
  return String(content[0].text);
}
