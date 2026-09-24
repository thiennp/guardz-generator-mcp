import assert from 'node:assert/strict';
import { mkdtemp, readFile, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import test from 'node:test';
import { fileURLToPath } from 'node:url';

import {
  applyTypeGuards,
  auditTypeGuards,
  explainType,
  previewTypeGuard,
} from '../src/application/guard-workflows.js';
import { GuardRequestError } from '../src/domain/guard-results.js';

const fixtures = path.join(path.dirname(fileURLToPath(import.meta.url)), 'fixtures');

const expected: Record<string, string> = {
  User: `import type { User } from './primitives';
import type { TypeGuardFn } from 'guardz';
import { isBoolean, isNumber, isString, isType } from 'guardz';

export const isUser: TypeGuardFn<User> = isType<User>({ id: isNumber, name: isString, active: isBoolean });
`,
  Profile: `import type { Profile } from './optional';
import type { TypeGuardFn } from 'guardz';
import { isString, isType, isUndefinedOr } from 'guardz';

export const isProfile: TypeGuardFn<Profile> = isType<Profile>({ name: isString, bio: isUndefinedOr(isString) });
`,
  Status: `import { isOneOf } from 'guardz';

export const isStatus = isOneOf<'failed' | 'ready'>('failed', 'ready');
`,
  ApiResponse: `import type { ApiResponse } from './generic';
import type { TypeGuardFn } from 'guardz';
import { isBoolean, isString, isType, isUndefinedOr } from 'guardz';

export const isApiResponse = <T>(typeGuardT: TypeGuardFn<T>): TypeGuardFn<ApiResponse<T>> =>
  isType<ApiResponse<T>>({ success: isBoolean, data: typeGuardT, message: isUndefinedOr(isString) });
`,
  TreeNode: `import type { TreeNode } from './tree';
import type { TypeGuardFnConfig } from 'guardz';
import { isArrayWithEachItem, isNumber, isType } from 'guardz';

export function isTreeNode(value: unknown, config?: TypeGuardFnConfig | null): value is TreeNode {
  return isType<TreeNode>({ value: isNumber, children: isArrayWithEachItem(isTreeNode) })(value, config);
}
`,
  Post: `import { isAuthor } from './isAuthor.guardz';
import type { Post } from './post';
import type { TypeGuardFn } from 'guardz';
import { isString, isType } from 'guardz';

export const isPost: TypeGuardFn<Post> = isType<Post>({ title: isString, author: isAuthor });
`,
};

test('preview matches fixtures for primitives, optionals, unions, generics, and recursion', async () => {
  const cases = [
    ['primitives.ts', 'User'],
    ['optional.ts', 'Profile'],
    ['union.ts', 'Status'],
    ['generic.ts', 'ApiResponse'],
    ['tree.ts', 'TreeNode'],
  ] as const;

  for (const [file, typeName] of cases) {
    const preview = await previewTypeGuard({
      files: [path.join(fixtures, file)],
      typeName,
    });
    assert.equal(preview.guards.length, 1);
    assert.equal(preview.guards[0]?.content, expected[typeName]);
  }
});

test('preview resolves a cross-file type reference', async () => {
  const preview = await previewTypeGuard({
    files: [path.join(fixtures, 'cross/post.ts'), path.join(fixtures, 'cross/user.ts')],
    typeName: 'Post',
  });
  assert.equal(preview.guards[0]?.content, expected.Post);
});

test('preview from a snippet returns source and does not require a project file', async () => {
  const preview = await previewTypeGuard({
    source: 'export interface Note { title: string }',
    typeName: 'Note',
  });
  assert.equal(preview.guards[0]?.fileName, 'isNote.guardz.ts');
  assert.match(preview.guards[0]?.content ?? '', /isNote/);
  assert.match(preview.guards[0]?.content ?? '', /isString/);
});

test('explain reports any and conditional types as limitations', async () => {
  const bag = await explainType({
    files: [path.join(fixtures, 'limits.ts')],
    typeName: 'Bag',
  });
  assert.ok(bag.limitations.some(item => item.includes('any')));
  assert.match(bag.guard?.content ?? '', /isAny/);

  const lookup = await explainType({
    files: [path.join(fixtures, 'limits.ts')],
    typeName: 'Lookup',
  });
  assert.ok(lookup.limitations.some(item => item.includes('Conditional')));
});

test('audit reports missing guards, then a clean tree, then stale output', async () => {
  const directory = await mkdtemp(path.join(tmpdir(), 'guardz-audit-'));
  const source = path.join(directory, 'primitives.ts');
  await writeFile(source, await readFile(path.join(fixtures, 'primitives.ts')));

  const missing = await auditTypeGuards([source]);
  assert.equal(missing.checked, 1);
  assert.equal(missing.issues[0]?.status, 'missing');

  await applyTypeGuards({ files: [source], typeName: 'User' });
  const clean = await auditTypeGuards([source]);
  assert.deepEqual(clean.issues, []);

  const guardFile = path.join(directory, 'isUser.guardz.ts');
  await writeFile(guardFile, 'export const isUser = () => false;\n');
  const stale = await auditTypeGuards([source]);
  assert.equal(stale.issues[0]?.status, 'stale');

  await rm(directory, { recursive: true, force: true });
});

test('rejects a request with no files and no source', async () => {
  await assert.rejects(() => previewTypeGuard({}), GuardRequestError);
});
