# Social Media Posts for Guardz Generator MCP Server

## Twitter/X Post
```
🚀 Just released: guardz-generator-mcp - Generate TypeScript type guards through AI assistants!

✅ Works with 30+ MCP clients (Claude, VS Code, Warp, etc.)
✅ Zero configuration needed
✅ Runtime type safety for your TypeScript projects

Try it: npm install -g guardz-generator-mcp
GitHub: https://github.com/thiennp/guardz-generator-mcp

#MCP #TypeScript #AI #DeveloperTools
```

## LinkedIn Post
```
Excited to share my latest open-source contribution to the AI development ecosystem!

I've built an MCP (Model Context Protocol) server that generates TypeScript type guards from source code, making runtime type safety accessible to AI assistants.

Key highlights:
• Works with 30+ MCP clients across desktop, web, and mobile platforms
• Zero configuration setup
• Bridges compile-time and runtime type safety
• Contributes to the growing MCP ecosystem

This tool helps developers maintain type safety when working with AI assistants, ensuring that generated code is both compile-time and runtime safe.

Check it out: https://github.com/thiennp/guardz-generator-mcp

#OpenSource #TypeScript #AI #DeveloperTools #MCP
```

## Reddit Post (r/typescript)
```
Title: "New MCP Server: Generate TypeScript Type Guards with AI Assistants"

I've built an MCP (Model Context Protocol) server that generates TypeScript type guards from your source code, making runtime type safety accessible to AI assistants like Claude, VS Code Copilot, and many others.

**What it does:**
- Takes your TypeScript interfaces and generates runtime type guards
- Works with 30+ MCP clients (Claude Desktop, VS Code, Warp, Zed, etc.)
- Zero configuration needed
- Includes post-processing (linting, formatting, validation)

**Example:**
```typescript
// Input interface
interface User {
  id: string;
  name: string;
  email: string;
  age?: number;
}

// Generated type guard
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

**Installation:**
```bash
npm install -g guardz-generator-mcp
```

**GitHub:** https://github.com/thiennp/guardz-generator-mcp

This bridges the gap between compile-time and runtime type safety, making it easier to work with external APIs and dynamic data while maintaining type safety.

What do you think? Would this be useful for your TypeScript projects?
```

## Hacker News Post
```
Title: "Show HN: MCP Server for TypeScript Type Guard Generation"

I've built an MCP (Model Context Protocol) server that generates TypeScript type guards from source code, making runtime type safety accessible to AI assistants.

**Key Features:**
- Works with 30+ MCP clients (Claude Desktop, VS Code, Warp, Zed, etc.)
- Zero configuration setup
- Generates robust runtime validation functions
- Includes post-processing (linting, formatting, validation)

**Why this matters:**
TypeScript provides compile-time type safety, but runtime type safety is often overlooked. This tool bridges that gap by generating type guards that can validate data at runtime, especially useful when working with external APIs or dynamic data.

**Installation:**
```bash
npm install -g guardz-generator-mcp
```

**GitHub:** https://github.com/thiennp/guardz-generator-mcp

**Example:**
Input a TypeScript interface, get a generated type guard function that validates data at runtime.

This is part of the growing MCP ecosystem that's making AI assistants more powerful for developers.

Would love feedback from the HN community!
``` 