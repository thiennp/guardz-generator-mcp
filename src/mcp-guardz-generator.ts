#!/usr/bin/env node

import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';

import { auditTypeGuards } from './application/guard-workflows.js';
import { createGuardzServer } from './presentation/create-server.js';

const packageJsonPath = join(
  dirname(fileURLToPath(import.meta.url)),
  '../package.json'
);
const packageVersion = (
  JSON.parse(readFileSync(packageJsonPath, 'utf8')) as { version: string }
).version;

async function runCheck(files: string[]): Promise<void> {
  const result = await auditTypeGuards(files);
  process.stderr.write(`${JSON.stringify(result, null, 2)}\n`);
  process.exit(result.issues.length > 0 ? 1 : 0);
}

async function runServer(): Promise<void> {
  const server = createGuardzServer(packageVersion);
  const transport = new StdioServerTransport();
  await server.connect(transport);
  process.stderr.write(
    `guardz-generator-mcp ${packageVersion} listening on stdio\n`
  );
}

const isEntry = process.argv[1]?.includes('mcp-guardz-generator');

if (isEntry) {
  const command = process.argv[2];
  if (command === 'check') {
    runCheck(process.argv.slice(3)).catch(error => {
      const message = error instanceof Error ? error.message : String(error);
      process.stderr.write(`${message}\n`);
      process.exit(1);
    });
  } else {
    runServer().catch(error => {
      const message = error instanceof Error ? error.message : String(error);
      process.stderr.write(`${message}\n`);
      process.exit(1);
    });
  }
}
