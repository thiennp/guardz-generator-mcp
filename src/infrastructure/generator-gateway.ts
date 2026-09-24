import path from 'node:path';

import { TypeGuardGenerator } from 'guardz-generator/dist/core/generators/type-guard/type-guard-generator.js';
import ts from 'typescript';

import type { GuardFile } from '../domain/guard-results.js';

/**
 * Single adapter over guardz-generator.
 * The published package entrypoint only re-exports domain types, so generation
 * still goes through TypeGuardGenerator. Nothing else in this repo imports it.
 */
const compilerOptions: ts.CompilerOptions = {
  target: ts.ScriptTarget.ES2022,
  module: ts.ModuleKind.CommonJS,
  strict: true,
  esModuleInterop: true,
  skipLibCheck: true,
};

export function resolveSourceFiles(files: readonly string[]): string[] {
  return files.map(file => path.resolve(file));
}

export function generateGuardFiles(
  files: readonly string[],
  options: { typeName?: string; guardName?: string } = {}
): GuardFile[] {
  const sourceFiles = resolveSourceFiles(files);
  const program = ts.createProgram(sourceFiles, compilerOptions);
  const generator = new TypeGuardGenerator(sourceFiles, program);

  if (options.typeName) {
    const content = generator.generateTypeGuard(options.typeName, {
      type: options.typeName,
      guardName: options.guardName,
      postProcess: false,
    });
    const declaration = findExportedType(
      program,
      sourceFiles,
      options.typeName
    );
    if (!declaration) {
      throw new Error(
        `Type "${options.typeName}" was not found in the given files.`
      );
    }
    const guardName = options.guardName ?? `is${options.typeName}`;
    return [
      {
        typeName: options.typeName,
        fileName: path.join(
          path.dirname(declaration.fileName),
          `${guardName}.guardz.ts`
        ),
        content,
      },
    ];
  }

  return generator.generateAllTypeGuards({ postProcess: false }).map(file => ({
    typeName: file.interfaceName,
    fileName: file.fileName,
    content: file.content,
  }));
}

export interface ExportedType {
  name: string;
  fileName: string;
  kind: 'interface' | 'type';
  members: string[];
  limitations: string[];
}

export function listExportedTypes(files: readonly string[]): ExportedType[] {
  const sourceFiles = resolveSourceFiles(files);
  const program = ts.createProgram(sourceFiles, compilerOptions);
  const found: ExportedType[] = [];

  for (const fileName of sourceFiles) {
    const sourceFile = program.getSourceFile(fileName);
    if (!sourceFile) {
      continue;
    }
    sourceFile.forEachChild(node => {
      if (!isExported(node)) {
        return;
      }
      if (ts.isInterfaceDeclaration(node)) {
        found.push(
          describeType(node.name.text, sourceFile.fileName, 'interface', node)
        );
      } else if (ts.isTypeAliasDeclaration(node)) {
        found.push(
          describeType(node.name.text, sourceFile.fileName, 'type', node)
        );
      }
    });
  }

  return found;
}

function findExportedType(
  program: ts.Program,
  files: readonly string[],
  typeName: string
): { fileName: string } | undefined {
  for (const fileName of files) {
    const sourceFile = program.getSourceFile(fileName);
    if (!sourceFile) {
      continue;
    }
    let match: { fileName: string } | undefined;
    sourceFile.forEachChild(node => {
      if (!isExported(node)) {
        return;
      }
      if (
        (ts.isInterfaceDeclaration(node) || ts.isTypeAliasDeclaration(node)) &&
        node.name.text === typeName
      ) {
        match = { fileName: sourceFile.fileName };
      }
    });
    if (match) {
      return match;
    }
  }
  return undefined;
}

function isExported(node: ts.Node): boolean {
  if (!ts.canHaveModifiers(node)) {
    return false;
  }
  return (
    node.modifiers?.some(
      modifier => modifier.kind === ts.SyntaxKind.ExportKeyword
    ) ?? false
  );
}

function describeType(
  name: string,
  fileName: string,
  kind: 'interface' | 'type',
  node: ts.InterfaceDeclaration | ts.TypeAliasDeclaration
): ExportedType {
  const members: string[] = [];
  const limitations: string[] = [];

  if (ts.isInterfaceDeclaration(node)) {
    for (const member of node.members) {
      if (
        ts.isPropertySignature(member) &&
        member.name &&
        ts.isIdentifier(member.name)
      ) {
        const optional = member.questionToken ? '?' : '';
        const typeText = member.type ? nodeText(member.type) : 'unknown';
        members.push(`${member.name.text}${optional}: ${typeText}`);
      } else if (ts.isIndexSignatureDeclaration(member)) {
        members.push(`[index]: ${nodeText(member.type)}`);
      } else if (ts.isMethodSignature(member)) {
        limitations.push(
          `Method "${nodeText(member.name)}" is not a runtime value and is skipped.`
        );
      }
    }
    collectLimitations(node, limitations);
  } else if (node.type) {
    members.push(nodeText(node.type));
    collectLimitations(node.type, limitations);
  }

  return { name, fileName, kind, members, limitations };
}

function collectLimitations(node: ts.Node, limitations: string[]): void {
  const visit = (current: ts.Node): void => {
    if (current.kind === ts.SyntaxKind.AnyKeyword) {
      pushUnique(
        limitations,
        '`any` is accepted by a permissive check and does not validate a shape.'
      );
    }
    if (current.kind === ts.SyntaxKind.ConditionalType) {
      pushUnique(
        limitations,
        'Conditional types are not fully recoverable at runtime.'
      );
    }
    if (current.kind === ts.SyntaxKind.MappedType) {
      pushUnique(
        limitations,
        'Mapped types are emitted as object checks, not as the mapped constraint.'
      );
    }
    if (
      current.kind === ts.SyntaxKind.InferType ||
      current.kind === ts.SyntaxKind.TypeQuery
    ) {
      pushUnique(
        limitations,
        '`infer` and `typeof` queries are compile-time only.'
      );
    }
    if (ts.isImportTypeNode(current)) {
      pushUnique(
        limitations,
        'Import types from other modules may fall back to a coarse check.'
      );
    }
    ts.forEachChild(current, visit);
  };
  visit(node);
}

function nodeText(node: ts.Node): string {
  const sourceFile = node.getSourceFile();
  if (!sourceFile) {
    return '';
  }
  return sourceFile.text.slice(node.getStart(sourceFile), node.getEnd()).trim();
}

function pushUnique(items: string[], value: string): void {
  if (!items.includes(value)) {
    items.push(value);
  }
}
