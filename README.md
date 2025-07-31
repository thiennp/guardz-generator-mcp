# Guardz Generator MCP Server

[![npm version](https://badge.fury.io/js/guardz-generator-mcp.svg)](https://badge.fury.io/js/guardz-generator-mcp)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

> MCP (Model Context Protocol) Server for TypeScript Type Guard Generation

A Model Context Protocol (MCP) server that generates **TypeScript type guards** from your TypeScript source code, allowing AI assistants to create robust runtime validation functions through a standardized interface.

## 🎯 Core Purpose

**Generate TypeScript type guards** from interfaces, types, unions, intersections, and complex TypeScript types. This is the primary functionality - everything else supports this goal.

## 🚀 Primary Feature: Type Guard Generation

### What are Type Guards?

Type guards are runtime validation functions that ensure your data matches your TypeScript types:

```typescript
// Your TypeScript interface
interface User {
  id: number;
  name: string;
  email: string;
  isActive: boolean;
}

// Generated type guard
import { isNumber, isString, isBoolean, isType } from 'guardz';

export const isUser = (value: unknown): value is User => {
  return isType(value, {
    id: isNumber,
    name: isString,
    email: isString,
    isActive: isBoolean,
  });
};
```

### Complex Type Examples

Generate type guards for complex types:

```typescript
interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  timestamp: number;
}

type UserResponse = ApiResponse<User>;
```

Generated type guard:

```typescript
import { isBoolean, isNumber, isString, isUndefinedOr, isType } from 'guardz';

export const isApiResponse = <T>(
  value: unknown,
  isT: (value: unknown) => value is T
): value is ApiResponse<T> => {
  return isType(value, {
    success: isBoolean,
    data: isT,
    message: isUndefinedOr(isString),
    timestamp: isNumber,
  });
};

export const isUserResponse = (value: unknown): value is UserResponse => {
  return isApiResponse(value, isUser);
};
```

## 📦 Installation

```bash
npm install guardz-generator-mcp
```

## 🔧 Setup

### 1. Install the MCP Server

```bash
npm install -g guardz-generator-mcp
```

### 2. Configure Your MCP Client

#### For Claude Desktop:

Create or edit your MCP configuration file (usually `~/.config/claude-desktop/mcp-servers.json`):

```json
{
  "mcpServers": {
    "guardz-generator": {
      "command": "guardz-generator-mcp",
      "env": {
        "NODE_ENV": "production"
      }
    }
  }
}
```

#### For Other MCP Clients:

Add the server to your MCP client configuration:

```json
{
  "mcpServers": {
    "guardz-generator": {
      "command": "npx",
      "args": ["guardz-generator-mcp"],
      "env": {
        "NODE_ENV": "production"
      }
    }
  }
}
```

## 🌐 MCP Client Compatibility

This MCP server is compatible with **many MCP clients** across different platforms:

### **Desktop Applications**
- **Claude Desktop** - Anthropic's desktop app
- **VS Code with GitHub Copilot** - Agent mode with MCP support
- **Warp** - Intelligent terminal with MCP integration
- **Zed** - High-performance code editor
- **Windsurf Editor** - Agentic IDE
- **Theia IDE** - AI-powered development environment
- **oterm** - Terminal client for Ollama
- **Tome** - Cross-platform desktop app for local LLMs
- **Witsy** - AI desktop assistant

### **Web-Based Platforms**
- **MooPoint** - Web-based AI chat platform
- **Msty Studio** - Privacy-first AI productivity platform
- **Superinterface** - AI infrastructure platform
- **Tambo** - Platform for building custom chat experiences
- **TypingMind** - Advanced frontend for LLMs
- **RecurseChat** - Local-first chat client
- **Shortwave** - AI-powered email client
- **WhatsMCP** - MCP client for WhatsApp

### **Development Tools**
- **Postman** - API client with MCP server testing
- **OpenSumi** - AI Native IDE framework
- **Roo Code** - AI coding assistance
- **Zencoder** - Coding agent for VS Code and JetBrains IDEs

### **Enterprise & Cloud Platforms**
- **NVIDIA Agent Intelligence (AIQ) toolkit** - Enterprise agent framework
- **Tencent CloudBase AI DevKit** - AI agent building tool
- **SpinAI** - Observable AI agent framework
- **Superjoin** - Google Sheets extension

### **Mobile Applications**
- **systemprompt** - Voice-controlled mobile app (iOS/Android)

## 🛠️ Available Tools

### Primary Tool: `generate_type_guards`

**Generate TypeScript type guards from source files** - This is the main functionality.

**Parameters:**
- `files` (required): Array of TypeScript files to process
- `config` (optional): Path to config file (defaults to `guardz.generator.config.ts`)
- `type` (optional): Generate type guard for specific type
- `guardName` (optional): Custom name for the type guard function
- `includes` (optional): Glob patterns for files to include
- `excludes` (optional): Glob patterns for files to exclude
- `postProcess` (optional): Run lint, prettier, and tsc on generated files (default: true)
- `verbose` (optional): Enable verbose logging
- `debug` (optional): Enable debug logging (creates log file)

**Example:**
```json
{
  "name": "generate_type_guards",
  "arguments": {
    "files": ["src/types/user.ts"],
    "postProcess": true,
    "verbose": true
  }
}
```

### Supporting Tools

These tools support the type guard generation workflow:

#### `discover_files`
**Helper to find TypeScript files for type guard generation**

**Parameters:**
- `cliFiles` (optional): Files specified via CLI
- `cliIncludes` (optional): Include patterns from CLI
- `cliExcludes` (optional): Exclude patterns from CLI
- `configPath` (optional): Path to config file

**Example:**
```json
{
  "name": "discover_files",
  "arguments": {
    "cliFiles": ["src/**/*.ts"],
    "cliExcludes": ["**/*.test.ts"]
  }
}
```

#### `validate_typescript`
**Helper to validate TypeScript before generating type guards**

**Parameters:**
- `files` (required): Array of TypeScript files to validate

**Example:**
```json
{
  "name": "validate_typescript",
  "arguments": {
    "files": ["src/**/*.ts"]
  }
}
```

#### `format_code`
**Helper to format generated type guard code**

**Parameters:**
- `files` (required): Array of files to format

**Example:**
```json
{
  "name": "format_code",
  "arguments": {
    "files": ["src/**/*.ts"]
  }
}
```

#### `lint_code`
**Helper to lint generated type guard code**

**Parameters:**
- `files` (required): Array of files to lint
- `fix` (optional): Automatically fix linting issues

**Example:**
```json
{
  "name": "lint_code",
  "arguments": {
    "files": ["src/**/*.ts"],
    "fix": true
  }
}
```

#### `get_project_info`
**Helper to get project context for type guard generation**

**Parameters:** None

**Example:**
```json
{
  "name": "get_project_info",
  "arguments": {}
}
```

## 💡 Usage Examples

### Basic Type Guard Generation

Generate type guards for all interfaces in your project:

```typescript
// Your TypeScript interface
interface User {
  id: number;
  name: string;
  email: string;
  isActive: boolean;
}
```

The MCP server will generate:

```typescript
import { isNumber, isString, isBoolean, isType } from 'guardz';

export const isUser = (value: unknown): value is User => {
  return isType(value, {
    id: isNumber,
    name: isString,
    email: isString,
    isActive: isBoolean,
  });
};
```

### Complex Type Guards

Generate type guards for complex types:

```typescript
interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  timestamp: number;
}

type UserResponse = ApiResponse<User>;
```

Generated type guard:

```typescript
import { isBoolean, isNumber, isString, isUndefinedOr, isType } from 'guardz';

export const isApiResponse = <T>(
  value: unknown,
  isT: (value: unknown) => value is T
): value is ApiResponse<T> => {
  return isType(value, {
    success: isBoolean,
    data: isT,
    message: isUndefinedOr(isString),
    timestamp: isNumber,
  });
};

export const isUserResponse = (value: unknown): value is UserResponse => {
  return isApiResponse(value, isUser);
};
```

### Recursive Type Example

```typescript
interface TreeNode {
  value: number;
  children: TreeNode[];
}
```

Generated type guard:

```typescript
import { isNumber, isArrayWithEachItem, isType } from 'guardz';

export const isTreeNode = (value: unknown): value is TreeNode => {
  return isType(value, {
    value: isNumber,
    children: isArrayWithEachItem(isTreeNode),
  });
};
```

### Empty Object Type Example

```typescript
interface Config {
  settings: {};
  metadata: Record<string, unknown>;
}
```

Generated type guard:

```typescript
import { isObjectWithEachItem, isType, isUnknown } from 'guardz';

export const isConfig = (value: unknown): value is Config => {
  return isType(value, {
    settings: isType({}), // Uses isType({}) instead of isType<{}>({})
    metadata: isObjectWithEachItem(isUnknown),
  });
};
```

## 🏗️ Architecture

The MCP server is built on top of the robust `guardz-generator` library and follows the Model Context Protocol specification:

```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   MCP Client    │    │  MCP Server      │    │ guardz-generator│
│   (Claude, etc) │◄──►│  (This Package)  │◄──►│  (Core Library) │
└─────────────────┘    └──────────────────┘    └─────────────────┘
```

### Key Components:

- **MCP Protocol Layer**: Handles JSON-RPC communication with MCP clients
- **Type Guard Generator**: Core logic for generating type guards from TypeScript AST
- **Tool Handlers**: Process specific tool requests (generate, validate, format, etc.)
- **Service Factory**: Manages dependencies and provides access to guardz-generator services

## 🔧 Development

### Prerequisites

- Node.js 18+
- npm or yarn

### Setup

1. Clone the repository:
```bash
git clone https://github.com/thiennp/guardz-generator-mcp.git
cd guardz-generator-mcp
```

2. Install dependencies:
```bash
npm install
```

3. Build the project:
```bash
npm run build
```

4. Run tests:
```bash
npm test
```

### Development Scripts

- `npm run build` - Build the TypeScript code
- `npm run dev` - Run in development mode with tsx
- `npm test` - Run the test suite
- `npm run lint` - Run ESLint
- `npm run format` - Format code with Prettier
- `npm run type-check` - Run TypeScript type checking

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request. For major changes, please open an issue first to discuss what you would like to change.

### Development Guidelines

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [guardz-generator](https://github.com/thiennp/guardz-generator) - The core type guard generation library
- [guardz](https://github.com/thiennp/guardz) - The runtime validation library
- [Model Context Protocol](https://modelcontextprotocol.io/) - The protocol specification
- [Anthropic](https://www.anthropic.com/) - For Claude and MCP ecosystem

## 📞 Support

- **Issues**: [GitHub Issues](https://github.com/thiennp/guardz-generator-mcp/issues)
- **Discussions**: [GitHub Discussions](https://github.com/thiennp/guardz-generator-mcp/discussions)
- **Documentation**: [Full Documentation](https://github.com/thiennp/guardz-generator-mcp#readme)

---

**Made with ❤️ for the TypeScript community** 