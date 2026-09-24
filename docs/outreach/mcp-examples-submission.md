# MCP Examples Repository Submission

## Repository Information
- **Name**: guardz-generator-mcp
- **GitHub**: https://github.com/thiennp/guardz-generator-mcp
- **npm**: https://www.npmjs.com/package/guardz-generator-mcp
- **Description**: Generate TypeScript type guards from source code through AI assistants

## Key Features
- ✅ **Primary Focus**: Type guard generation as core functionality
- ✅ **30+ MCP Client Compatibility**: Works with Claude Desktop, VS Code, Warp, Zed, and many more
- ✅ **Zero Configuration**: Works out of the box with sensible defaults
- ✅ **Runtime Validation**: Creates robust type guards using the guardz library
- ✅ **Post-Processing**: Integrated linting, formatting, and TypeScript validation

## Installation
```bash
npm install -g guardz-generator-mcp
```

## Configuration
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

## Example Usage
```typescript
// Input: TypeScript interface
interface User {
  id: string;
  name: string;
  email: string;
  age?: number;
}

// Output: Generated type guard
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

## Why This Matters
- **Type Safety**: Bridges compile-time and runtime type safety
- **Developer Experience**: Automates tedious type guard writing
- **AI Integration**: Makes type guard generation accessible to AI assistants
- **Ecosystem Growth**: Contributes to the growing MCP ecosystem

## License
MIT License

## Tags
- typescript
- type-safety
- code-generation
- runtime-validation
- developer-tools 