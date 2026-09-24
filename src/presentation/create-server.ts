import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';

import {
  applyTypeGuards,
  auditTypeGuards,
  explainType,
  previewTypeGuard,
  type GuardRequest,
} from '../application/guard-workflows.js';
import { GuardRequestError } from '../domain/guard-results.js';

const requestShape = {
  files: z
    .array(z.string())
    .optional()
    .describe('TypeScript source files. Omit when passing source.'),
  source: z
    .string()
    .optional()
    .describe(
      'TypeScript snippet. The tool writes nothing until apply_type_guards.'
    ),
  typeName: z
    .string()
    .optional()
    .describe('Export to generate. Omit to cover every export in files.'),
  guardName: z
    .string()
    .optional()
    .describe('Override the generated function name.'),
};

const ADD_RUNTIME_GUARD_PROMPT = [
  'Add a guardz runtime guard that matches the TypeScript type exactly.',
  'Call audit_type_guards first when files already exist.',
  'Call preview_type_guard and show the source before any write.',
  'Call explain_type when the type is generic, conditional, or imported.',
  'Call apply_type_guards only for types the user named.',
  'If limitations is not empty, stop and report them instead of writing a guard.',
].join(' ');

export function createGuardzServer(version: string): McpServer {
  const server = new McpServer({
    name: 'guardz-generator-mcp',
    version,
  });

  server.registerTool(
    'preview_type_guard',
    {
      title: 'Preview a type guard',
      description:
        'Return guardz guard source for TypeScript files or a snippet. Writes nothing. Use this before apply_type_guards.',
      inputSchema: requestShape,
    },
    async args => runTool(() => previewTypeGuard(args as GuardRequest))
  );

  server.registerTool(
    'apply_type_guards',
    {
      title: 'Write type guards',
      description:
        'Write guardz guards next to the source files. Does not run lint, Prettier, or tsc. Preview first, then apply only the types the user asked for.',
      inputSchema: requestShape,
    },
    async args => runTool(() => applyTypeGuards(args as GuardRequest))
  );

  server.registerTool(
    'audit_type_guards',
    {
      title: 'Audit type guard drift',
      description:
        'List exported types whose is*.guardz.ts file is missing or differs from a fresh generation. Call this before editing guards.',
      inputSchema: {
        files: z
          .array(z.string())
          .describe('TypeScript files to compare with their guard files.'),
      },
    },
    async args => runTool(() => auditTypeGuards(args.files))
  );

  server.registerTool(
    'explain_type',
    {
      title: 'Explain a type before generating',
      description:
        'Describe the members a guard will check and any construct the generator cannot represent. Use this when preview output looks wrong.',
      inputSchema: {
        ...requestShape,
        typeName: z.string().describe('Exported type or interface name.'),
      },
    },
    async args => runTool(() => explainType(args as GuardRequest))
  );

  server.registerPrompt(
    'add-runtime-guard',
    {
      title: 'Add a runtime guard',
      description:
        'Preview, explain limitations, then apply a guardz type guard.',
      argsSchema: {
        typeName: z.string().describe('Type that needs a runtime guard.'),
      },
    },
    async ({ typeName }) => ({
      messages: [
        {
          role: 'user',
          content: {
            type: 'text',
            text: `${ADD_RUNTIME_GUARD_PROMPT} Type: ${typeName}.`,
          },
        },
      ],
    })
  );

  return server;
}

async function runTool(action: () => Promise<unknown>): Promise<{
  isError?: true;
  content: Array<{ type: 'text'; text: string }>;
  structuredContent?: Record<string, unknown>;
}> {
  try {
    const data = await action();
    return {
      content: [{ type: 'text', text: JSON.stringify(data, null, 2) }],
      structuredContent: data as Record<string, unknown>,
    };
  } catch (error) {
    return errorResult(error);
  }
}

export function errorResult(error: unknown): {
  isError: true;
  content: Array<{ type: 'text'; text: string }>;
} {
  const message =
    error instanceof GuardRequestError
      ? error.message
      : error instanceof Error
        ? error.message
        : String(error);
  return {
    isError: true,
    content: [{ type: 'text', text: message }],
  };
}
