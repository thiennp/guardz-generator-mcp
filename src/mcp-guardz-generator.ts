#!/usr/bin/env node

/**
 * MCP (Model Context Protocol) Server for Guardz Generator
 *
 * This MCP server exposes the guardz-generator functionality through a standardized
 * interface, allowing AI assistants to interact with the type guard generator.
 */

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from '@modelcontextprotocol/sdk/types.js';
import { TypeGuardGenerator } from 'guardz-generator/dist/core/generators/type-guard/type-guard-generator.js';
import { ServiceFactory } from 'guardz-generator/dist/infrastructure/factories/service-factory.js';
import {
  setDebugMode,
  setVerboseMode,
} from 'guardz-generator/dist/shared/utils/logging.js';

import type { TypeGuardOptions } from 'guardz-generator';
import type { ProgramCreationOptions } from 'guardz-generator/dist/infrastructure/pipelines/typescript-program/interfaces.js';

interface GenerateTypeGuardsArgs {
  files: string[];
  config?: string;
  type?: string;
  guardName?: string;
  includes?: string[];
  excludes?: string[];
  postProcess?: boolean;
  verbose?: boolean;
  debug?: boolean;
}

interface DiscoverFilesArgs {
  cliFiles?: string[];
  cliIncludes?: string[];
  cliExcludes?: string[];
  configPath?: string;
}

interface ValidateTypeScriptArgs {
  files: string[];
}

interface FormatCodeArgs {
  files: string[];
}

interface LintCodeArgs {
  files: string[];
  fix?: boolean;
}

class GuardzGeneratorMCPServer {
  private server: Server;

  constructor() {
    this.server = new Server({
      name: 'guardz-generator-mcp',
      version: '1.0.0',
    });

    this.setupToolHandlers();
  }

  setupToolHandlers(): void {
    // List available tools
    this.server.setRequestHandler(ListToolsRequestSchema, async () => {
      return {
        tools: [
          {
            name: 'generate_type_guards',
            description: 'Generate TypeScript type guards from source files',
            inputSchema: {
              type: 'object',
              properties: {
                files: {
                  type: 'array',
                  items: { type: 'string' },
                  description: 'TypeScript files to process',
                },
                config: {
                  type: 'string',
                  description:
                    'Path to config file (defaults to guardz.generator.config.ts)',
                },
                type: {
                  type: 'string',
                  description: 'Generate type guard for specific type',
                },
                guardName: {
                  type: 'string',
                  description: 'Custom name for the type guard function',
                },
                includes: {
                  type: 'array',
                  items: { type: 'string' },
                  description: 'Glob patterns for files to include',
                },
                excludes: {
                  type: 'array',
                  items: { type: 'string' },
                  description: 'Glob patterns for files to exclude',
                },
                postProcess: {
                  type: 'boolean',
                  description:
                    'Run lint, prettier, and tsc on generated files (default: true)',
                },
                verbose: {
                  type: 'boolean',
                  description: 'Enable verbose logging',
                },
                debug: {
                  type: 'boolean',
                  description: 'Enable debug logging (creates log file)',
                },
              },
              required: ['files'],
            },
          },
          {
            name: 'discover_files',
            description: 'Discover TypeScript files using various strategies',
            inputSchema: {
              type: 'object',
              properties: {
                cliFiles: {
                  type: 'array',
                  items: { type: 'string' },
                  description: 'Files specified via CLI',
                },
                cliIncludes: {
                  type: 'array',
                  items: { type: 'string' },
                  description: 'Include patterns from CLI',
                },
                cliExcludes: {
                  type: 'array',
                  items: { type: 'string' },
                  description: 'Exclude patterns from CLI',
                },
                configPath: {
                  type: 'string',
                  description: 'Path to config file',
                },
              },
            },
          },
          {
            name: 'validate_typescript',
            description: 'Validate TypeScript files for compilation errors',
            inputSchema: {
              type: 'object',
              properties: {
                files: {
                  type: 'array',
                  items: { type: 'string' },
                  description: 'TypeScript files to validate',
                },
              },
              required: ['files'],
            },
          },
          {
            name: 'format_code',
            description: 'Format TypeScript code using Prettier',
            inputSchema: {
              type: 'object',
              properties: {
                files: {
                  type: 'array',
                  items: { type: 'string' },
                  description: 'Files to format',
                },
              },
              required: ['files'],
            },
          },
          {
            name: 'lint_code',
            description: 'Lint TypeScript code using ESLint',
            inputSchema: {
              type: 'object',
              properties: {
                files: {
                  type: 'array',
                  items: { type: 'string' },
                  description: 'Files to lint',
                },
                fix: {
                  type: 'boolean',
                  description: 'Automatically fix linting issues',
                },
              },
              required: ['files'],
            },
          },
          {
            name: 'get_project_info',
            description: 'Get information about the current project',
            inputSchema: {
              type: 'object',
              properties: {},
            },
          },
        ],
      };
    });

    // Handle tool calls
    this.server.setRequestHandler(CallToolRequestSchema, async request => {
      const { name, arguments: args } = request.params;

      try {
        switch (name) {
          case 'generate_type_guards':
            return await this.generateTypeGuards(
              args as unknown as GenerateTypeGuardsArgs
            );
          case 'discover_files':
            return await this.discoverFiles(
              args as unknown as DiscoverFilesArgs
            );
          case 'validate_typescript':
            return await this.validateTypeScript(
              args as unknown as ValidateTypeScriptArgs
            );
          case 'format_code':
            return await this.formatCode(args as unknown as FormatCodeArgs);
          case 'lint_code':
            return await this.lintCode(args as unknown as LintCodeArgs);
          case 'get_project_info':
            return await this.getProjectInfo();
          default:
            throw new Error(`Unknown tool: ${name}`);
        }
      } catch (error) {
        return {
          content: [
            {
              type: 'text',
              text: `Error: ${error instanceof Error ? error.message : String(error)}`,
            },
          ],
        };
      }
    });
  }

  async generateTypeGuards(args: GenerateTypeGuardsArgs) {
    const {
      files,
      config,
      type,
      guardName,
      includes,
      excludes,
      postProcess = true,
      verbose = false,
      debug = false,
    } = args;

    // Set logging modes
    setVerboseMode(verbose);
    setDebugMode(debug);

    try {
      // Use the file discovery pipeline
      const fileDiscoveryPipeline = ServiceFactory.getFileDiscoveryPipeline();

      const discoveryOptions = {
        cliFiles: files,
        cliIncludes: includes,
        cliExcludes: excludes,
        configPath: config,
      };

      const discoveryResult =
        await fileDiscoveryPipeline.discoverFiles(discoveryOptions);

      if (discoveryResult.files.length === 0) {
        return {
          content: [
            {
              type: 'text',
              text: `No files found from ${discoveryResult.source} source. Please provide files argument, configure includes in guardz.generator.config.ts, or ensure tsconfig.json exists.`,
            },
          ],
        };
      }

      // Create TypeScript program
      const typescriptProgramPipeline =
        ServiceFactory.getTypeScriptProgramPipeline();
      const programOptions: ProgramCreationOptions = {
        sourceFiles: discoveryResult.files,
        tsConfigPath: config,
      };

      const programResult =
        await typescriptProgramPipeline.createProgram(programOptions);

      // Generate type guards
      const generator = new TypeGuardGenerator(
        discoveryResult.files,
        programResult.program
      );

      const options: Partial<TypeGuardOptions> = {
        type,
        guardName,
        postProcess,
      };

      const generatedFiles = generator.generateAllTypeGuards(options);

      // Write files to same directory
      await generator.writeTypeGuardsToSameDirectory(generatedFiles);

      // Run post-processing if enabled
      if (postProcess) {
        await generator.runPostProcessing(generatedFiles);
      }

      const fileList = generatedFiles
        .map((f: { fileName: string }) => f.fileName)
        .join('\n- ');

      return {
        content: [
          {
            type: 'text',
            text: `Successfully generated ${generatedFiles.length} type guard files:\n\n- ${fileList}\n\nFiles were written to the same directory as their source files.`,
          },
        ],
      };
    } catch (error) {
      return {
        content: [
          {
            type: 'text',
            text: `Error generating type guards: ${error instanceof Error ? error.message : String(error)}`,
          },
        ],
      };
    }
  }

  async discoverFiles(args: DiscoverFilesArgs) {
    const { cliFiles, cliIncludes, cliExcludes, configPath } = args;

    try {
      const fileDiscoveryPipeline = ServiceFactory.getFileDiscoveryPipeline();

      const discoveryOptions = {
        cliFiles,
        cliIncludes,
        cliExcludes,
        configPath,
      };

      const discoveryResult =
        await fileDiscoveryPipeline.discoverFiles(discoveryOptions);

      return {
        content: [
          {
            type: 'text',
            text: `Discovered ${discoveryResult.files.length} files from ${discoveryResult.source} source:\n\n${discoveryResult.files.join('\n')}`,
          },
        ],
      };
    } catch (error) {
      return {
        content: [
          {
            type: 'text',
            text: `Error discovering files: ${error instanceof Error ? error.message : String(error)}`,
          },
        ],
      };
    }
  }

  async validateTypeScript(args: ValidateTypeScriptArgs) {
    const { files } = args;

    try {
      const typescriptCompiler = ServiceFactory.getTypeScriptCompiler();
      await typescriptCompiler.checkFiles(files);

      return {
        content: [
          {
            type: 'text',
            text: `Successfully validated ${files.length} TypeScript files. No compilation errors found.`,
          },
        ],
      };
    } catch (error) {
      return {
        content: [
          {
            type: 'text',
            text: `TypeScript validation failed: ${error instanceof Error ? error.message : String(error)}`,
          },
        ],
      };
    }
  }

  async formatCode(args: FormatCodeArgs) {
    const { files } = args;

    try {
      const prettier = ServiceFactory.getPrettier();
      const fileSystem = ServiceFactory.getFileSystem();

      for (const file of files) {
        const content = await fileSystem.readFile(file);
        const formatted = await prettier.format(content, { filepath: file });
        await fileSystem.writeFile(file, formatted);
      }

      return {
        content: [
          {
            type: 'text',
            text: `Successfully formatted ${files.length} files using Prettier.`,
          },
        ],
      };
    } catch (error) {
      return {
        content: [
          {
            type: 'text',
            text: `Error formatting code: ${error instanceof Error ? error.message : String(error)}`,
          },
        ],
      };
    }
  }

  async lintCode(args: LintCodeArgs) {
    const { files, fix = false } = args;

    try {
      const eslint = ServiceFactory.getESLint();

      if (fix) {
        await eslint.fixFiles(files);
        return {
          content: [
            {
              type: 'text',
              text: `Successfully linted and fixed ${files.length} files using ESLint.`,
            },
          ],
        };
      } else {
        // For now, we'll just run the fix command as the basic lint check
        await eslint.fixFiles(files);
        return {
          content: [
            {
              type: 'text',
              text: `Successfully linted ${files.length} files using ESLint.`,
            },
          ],
        };
      }
    } catch (error) {
      return {
        content: [
          {
            type: 'text',
            text: `Error linting code: ${error instanceof Error ? error.message : String(error)}`,
          },
        ],
      };
    }
  }

  async getProjectInfo(): Promise<{
    content: Array<{ type: string; text: string }>;
  }> {
    try {
      const fileSystem = ServiceFactory.getFileSystem();

      // Check for common config files
      const configFiles = [
        'guardz.generator.config.ts',
        'tsconfig.json',
        'package.json',
      ];

      const existingConfigs = [];
      for (const config of configFiles) {
        if (await fileSystem.fileExists(config)) {
          existingConfigs.push(config);
        }
      }

      return {
        content: [
          {
            type: 'text',
            text: `Project Information:\n\nAvailable configuration files:\n${existingConfigs.map(f => `- ${f}`).join('\n')}\n\nGuardz Generator MCP version: 1.0.0\nCompatible with guardz-generator: 1.11.6`,
          },
        ],
      };
    } catch (error) {
      return {
        content: [
          {
            type: 'text',
            text: `Error getting project info: ${error instanceof Error ? error.message : String(error)}`,
          },
        ],
      };
    }
  }

  async run(): Promise<void> {
    const transport = new StdioServerTransport();
    await this.server.connect(transport);
    console.error('Guardz Generator MCP Server started');
  }
}

// Start the server
const server = new GuardzGeneratorMCPServer();
server.run().catch(console.error);
