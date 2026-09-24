import { mkdtemp, readFile, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';

import {
  GuardRequestError,
  type ApplyResult,
  type AuditResult,
  type PreviewResult,
  type TypeExplanation,
} from '../domain/guard-results.js';
import {
  generateGuardFiles,
  listExportedTypes,
} from '../infrastructure/generator-gateway.js';

export interface GuardRequest {
  files?: string[];
  source?: string;
  typeName?: string;
  guardName?: string;
}

export async function previewTypeGuard(
  request: GuardRequest
): Promise<PreviewResult> {
  const files = await resolveInputFiles(request);
  try {
    return { guards: await collectGuards(request, files) };
  } finally {
    await cleanupSnippet(request, files);
  }
}

export async function applyTypeGuards(
  request: GuardRequest
): Promise<ApplyResult> {
  const files = await resolveInputFiles(request);
  try {
    const guards = await collectGuards(request, files);
    const written: string[] = [];
    for (const guard of guards) {
      const destination = request.source
        ? path.join(process.cwd(), path.basename(guard.fileName))
        : guard.fileName;
      await writeFile(destination, guard.content, 'utf8');
      written.push(destination);
    }
    return { written };
  } finally {
    await cleanupSnippet(request, files);
  }
}

export async function auditTypeGuards(
  files: readonly string[]
): Promise<AuditResult> {
  if (files.length === 0) {
    throw new GuardRequestError(
      'Provide at least one TypeScript file to audit.'
    );
  }
  const uniqueFiles = [...new Set(files)];
  const exportedTypes = listExportedTypes(uniqueFiles).filter(
    type => !type.fileName.endsWith('.guardz.ts')
  );
  const issues: AuditResult['issues'] = [];

  for (const exportedType of exportedTypes) {
    const [generated] = generateGuardFiles(uniqueFiles, {
      typeName: exportedType.name,
    });
    if (!generated) {
      continue;
    }
    let current = '';
    try {
      current = await readFile(generated.fileName, 'utf8');
    } catch {
      issues.push({
        typeName: exportedType.name,
        sourceFile: exportedType.fileName,
        guardFile: generated.fileName,
        status: 'missing',
      });
      continue;
    }
    if (normalize(current) !== normalize(generated.content)) {
      issues.push({
        typeName: exportedType.name,
        sourceFile: exportedType.fileName,
        guardFile: generated.fileName,
        status: 'stale',
      });
    }
  }

  return { checked: exportedTypes.length, issues };
}

export async function explainType(
  request: GuardRequest
): Promise<TypeExplanation> {
  if (!request.typeName) {
    throw new GuardRequestError('typeName is required to explain a type.');
  }
  const files = await resolveInputFiles(request);
  try {
    const exported = listExportedTypes(files).find(
      type => type.name === request.typeName
    );
    if (!exported) {
      throw new GuardRequestError(
        `Type "${request.typeName}" was not found in the given files.`
      );
    }
    let guard = null;
    const limitations = [...exported.limitations];
    try {
      const [generated] = generateGuardFiles(files, {
        typeName: request.typeName,
        guardName: request.guardName,
      });
      guard = generated ?? null;
    } catch (error) {
      limitations.push(
        error instanceof Error
          ? error.message
          : 'The generator could not emit a guard for this type.'
      );
    }
    return {
      typeName: exported.name,
      sourceFile: exported.fileName,
      kind: exported.kind,
      members: exported.members,
      limitations,
      guard,
    };
  } finally {
    await cleanupSnippet(request, files);
  }
}

async function collectGuards(request: GuardRequest, files: readonly string[]) {
  const guards = generateGuardFiles(files, {
    typeName: request.typeName,
    guardName: request.guardName,
  });
  if (guards.length === 0) {
    throw new GuardRequestError(
      'No exported interfaces or type aliases were found.'
    );
  }
  if (!request.source) {
    return guards;
  }
  return guards.map(guard => ({
    ...guard,
    fileName: path.basename(guard.fileName),
  }));
}

async function resolveInputFiles(request: GuardRequest): Promise<string[]> {
  const files = request.files?.filter(file => file.length > 0) ?? [];
  if (files.length > 0 && request.source) {
    throw new GuardRequestError('Pass either files or source, not both.');
  }
  if (files.length > 0) {
    return files;
  }
  if (!request.source) {
    throw new GuardRequestError(
      'Provide files or a TypeScript source snippet.'
    );
  }
  const directory = await mkdtemp(path.join(tmpdir(), 'guardz-mcp-'));
  const fileName = path.join(directory, 'snippet.ts');
  await writeFile(fileName, request.source, 'utf8');
  return [fileName];
}

async function cleanupSnippet(
  request: GuardRequest,
  files: readonly string[]
): Promise<void> {
  if (request.source && files[0]) {
    await rm(path.dirname(files[0]), { recursive: true, force: true });
  }
}

function normalize(content: string): string {
  return content.replace(/\r\n/g, '\n').trim();
}
