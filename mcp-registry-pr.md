# 🚀 MCP Registry Pull Request

## **Title**
Add guardz-generator-mcp to MCP Registry

## **Description**
This PR adds `guardz-generator-mcp` to the MCP registry. This server provides AI-powered TypeScript type guard generation using the Model Context Protocol.

## **Features**
- Generate runtime validation functions from TypeScript interfaces
- 6 powerful tools for complete type guard generation workflow
- Zero configuration setup
- Works with Claude Desktop, Cursor, VS Code

## **Installation**
```bash
npm install -g guardz-generator-mcp
```

## **Configuration**
```json
{
  "mcpServers": {
    "guardz-generator-mcp": {
      "command": "guardz-generator-mcp",
      "args": []
    }
  }
}
```

## **Usage**
Ask AI assistants to generate type guards:
```
"Generate type guards for the User interface in my project"
```

## **Links**
- **npm**: https://www.npmjs.com/package/guardz-generator-mcp
- **GitHub**: https://github.com/thiennp/guardz-generator-mcp
- **Documentation**: https://github.com/thiennp/guardz-generator-mcp#readme

## **Registry Entry**
```json
{
  "mcpServers": {
    "guardz-generator-mcp": {
      "command": "guardz-generator-mcp",
      "args": [],
      "description": "AI-powered TypeScript type guard generation using MCP"
    }
  }
}
```

## **Tools Available**
1. `generate_type_guards` - Main functionality
2. `discover_files` - File discovery
3. `validate_typescript` - Type validation
4. `format_code` - Code formatting
5. `lint_code` - Code linting
6. `get_project_info` - Project context

## **Testing**
The server has been tested with:
- Claude Desktop
- Cursor IDE
- VS Code (with MCP extension)
- Various TypeScript projects

## **License**
MIT License

---

**Ready for review! 🚀** 