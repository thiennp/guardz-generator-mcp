# 📱 Reddit Submission Templates

## 🎯 **r/typescript**

**Title**: "Just published guardz-generator-mcp: Generate TypeScript type guards with AI assistants using MCP"

**Content**:
```
Hey TypeScript community! 👋

I just published `guardz-generator-mcp` to npm - an MCP (Model Context Protocol) server that enables AI assistants like Claude Desktop to generate TypeScript type guards.

## What it does:
- Generates runtime validation functions from TypeScript interfaces
- Integrates with Claude Desktop and other MCP clients
- Provides 6 powerful tools for type guard generation
- Zero configuration setup

## Example:
```typescript
interface User {
  id: string;
  name: string;
  email: string;
  age?: number;
}
```

AI generates:
```typescript
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

## Installation:
```bash
npm install -g guardz-generator-mcp
```

## GitHub: https://github.com/thiennp/guardz-generator-mcp
## npm: https://www.npmjs.com/package/guardz-generator-mcp

Would love feedback from the community! 🚀
```

---

## 🎯 **r/javascript**

**Title**: "Generate TypeScript type guards with AI - New MCP server for JavaScript/TypeScript developers"

**Content**:
```
JavaScript/TypeScript developers! 🎉

I've created `guardz-generator-mcp` - an MCP (Model Context Protocol) server that lets AI assistants generate TypeScript type guards for runtime validation.

## Perfect for:
- TypeScript projects needing runtime validation
- API developers working with external data
- Full-stack developers wanting type safety
- Anyone using AI assistants for development

## Features:
- ✅ 6 AI-powered tools
- ✅ Claude Desktop integration
- ✅ Zero configuration
- ✅ Open source

## Quick start:
```bash
npm install -g guardz-generator-mcp
```

Then configure with your MCP client (Claude Desktop, Cursor, etc.)

## Real-world use case:
Instead of manually writing type guards for API responses, let AI generate them automatically!

GitHub: https://github.com/thiennp/guardz-generator-mcp
npm: https://www.npmjs.com/package/guardz-generator-mcp

What do you think? 🤔
```

---

## 🎯 **r/programming**

**Title**: "AI-powered TypeScript type guard generation using MCP (Model Context Protocol)"

**Content**:
```
Hey r/programming! 👋

I've been working on an interesting project that combines AI assistants with TypeScript development through MCP (Model Context Protocol).

## The Problem:
TypeScript provides compile-time type safety, but runtime validation is still manual and error-prone.

## The Solution:
`guardz-generator-mcp` - an MCP server that enables AI assistants to generate TypeScript type guards automatically.

## How it works:
1. Define TypeScript interfaces
2. AI assistant generates runtime validation functions
3. Get type safety at both compile-time and runtime

## Example workflow:
```typescript
// You define this
interface User {
  id: string;
  name: string;
  email: string;
}

// AI generates this automatically
export function isUser(value: unknown): value is User {
  return (
    isObject(value) &&
    isString((value as User).id) &&
    isString((value as User).name) &&
    isString((value as User).email)
  );
}
```

## Available on npm:
```bash
npm install -g guardz-generator-mcp
```

GitHub: https://github.com/thiennp/guardz-generator-mcp

This is part of the growing MCP ecosystem that's making AI assistants more powerful for developers. What do you think about this approach? 🤔
```

---

## 🎯 **r/artificial**

**Title**: "AI + TypeScript: Generating runtime validation with MCP (Model Context Protocol)"

**Content**:
```
AI/ML community! 🤖

I've created an interesting application of AI in software development: `guardz-generator-mcp` - an MCP (Model Context Protocol) server that enables AI assistants to generate TypeScript type guards.

## The Concept:
- Use AI assistants (Claude, etc.) for code generation
- MCP provides a standardized protocol for AI-tool interaction
- Generate runtime validation from TypeScript interfaces

## Technical Details:
- 6 AI-powered tools for type guard generation
- Integrates with Claude Desktop and other MCP clients
- Zero configuration setup
- Open source implementation

## Example:
```typescript
// Human defines interface
interface User {
  id: string;
  name: string;
  email: string;
}

// AI generates runtime validation
export function isUser(value: unknown): value is User {
  return (
    isObject(value) &&
    isString((value as User).id) &&
    isString((value as User).name) &&
    isString((value as User).email)
  );
}
```

## Available on npm:
```bash
npm install -g guardz-generator-mcp
```

GitHub: https://github.com/thiennp/guardz-generator-mcp

This represents the future of AI-assisted development. What are your thoughts on MCP and AI-tool integration? 🚀
```

---

## 📊 **Submission Strategy**

### **Timing**:
- **Best times**: Tuesday-Thursday, 9 AM - 2 PM EST
- **Avoid**: Weekends, holidays, major tech events

### **Frequency**:
- **Week 1**: r/typescript (primary audience)
- **Week 2**: r/javascript (broader audience)
- **Week 3**: r/programming (general programming)
- **Week 4**: r/artificial (AI/ML community)

### **Engagement Tips**:
- Respond to all comments within 24 hours
- Provide helpful answers to questions
- Share additional resources when relevant
- Thank users for feedback and suggestions

---

**Ready to submit! 🚀** 