# Guardz Generator MCP Server

[![npm version](https://badge.fury.io/js/guardz-generator-mcp.svg)](https://badge.fury.io/js/guardz-generator-mcp)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

> MCP (Model Context Protocol) Server for Guardz Generator - TypeScript Type Guard Generation

A Model Context Protocol (MCP) server that exposes the powerful type guard generation capabilities of [guardz-generator](https://github.com/thiennp/guardz-generator) through a standardized interface, allowing AI assistants to interact with TypeScript type guard generation.

## 🚀 Features

- **Complete TypeScript Support**: Generate type guards for interfaces, types, unions, intersections, and more
- **AI Assistant Integration**: Seamless integration with Claude Desktop, Anthropic's Claude, and other MCP-compatible clients
- **Runtime Validation**: Generate robust runtime validation functions using the [guardz](https://github.com/thiennp/guardz) library
- **Smart File Discovery**: Automatic discovery of TypeScript files using multiple strategies
- **Post-Processing**: Integrated linting, formatting, and TypeScript validation
- **Zero Configuration**: Works out of the box with sensible defaults

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

## 🛠️ Available Tools

### `generate_type_guards`

Generate TypeScript type guards from source files.

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

### `discover_files`

Discover TypeScript files using various strategies.

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

### `validate_typescript`

Validate TypeScript files for compilation errors.

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

### `format_code`

Format TypeScript code using Prettier.

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

### `lint_code`

Lint TypeScript code using ESLint.

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

### `get_project_info`

Get information about the current project.

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
  id: string;
  name: string;
  email: string;
  age?: number;
}
```

The MCP server will generate:

```typescript
import { isString, isNumber, isObject } from 'guardz';

export function isUser(value: unknown): value is User {
  return (
    isObject(value) &&
    isString((value as User).id) &&
    isString((value as User).name) &&
    isString((value as User).email) &&
    ((value as User).age === undefined || isNumber((value as User).age))
  );
}
```

### Complex Type Guards

Generate type guards for complex types:

```typescript
interface ApiResponse<T> {
  data: T;
  status: 'success' | 'error';
  message?: string;
}

type UserResponse = ApiResponse<User>;
```

Generated type guard:

```typescript
import { isString, isObject } from 'guardz';

export function isUserResponse(value: unknown): value is UserResponse {
  return (
    isObject(value) &&
    isUser((value as UserResponse).data) &&
    (isString((value as UserResponse).status) &&
      ((value as UserResponse).status === 'success' ||
        (value as UserResponse).status === 'error')) &&
    ((value as UserResponse).message === undefined ||
      isString((value as UserResponse).message))
  );
}
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
- **Tool Handlers**: Process specific tool requests (generate, validate, format, etc.)
- **Service Factory**: Manages dependencies and provides access to guardz-generator services
- **Type Guard Generator**: Core logic for generating type guards from TypeScript AST

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