# 🤖 AI Tools Directory Submissions

## 🎯 **MCP Registry**

### **Official MCP Registry**
- **URL**: https://github.com/modelcontextprotocol/registry
- **Process**: Submit a pull request to add your server
- **File**: `mcp-registry.json` (already created)

### **Submission Template**
```markdown
## Add guardz-generator-mcp to MCP Registry

### Description
AI-powered TypeScript type guard generation using MCP (Model Context Protocol)

### Features
- Generate runtime validation functions from TypeScript interfaces
- 6 powerful tools for complete type guard generation workflow
- Zero configuration setup
- Works with Claude Desktop, Cursor, VS Code

### Links
- npm: https://www.npmjs.com/package/guardz-generator-mcp
- GitHub: https://github.com/thiennp/guardz-generator-mcp
- Documentation: https://github.com/thiennp/guardz-generator-mcp#readme

### Registry Entry
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
```

---

## 🎯 **Cursor IDE Marketplace**

### **Cursor Extension Directory**
- **URL**: https://cursor.sh/extensions
- **Process**: Submit extension for review
- **Category**: Developer Tools

### **Submission Template**
```markdown
## guardz-generator-mcp for Cursor

### Extension Name
Guardz Generator MCP

### Description
Generate TypeScript type guards with AI assistance using MCP protocol. Provides 6 powerful tools for runtime validation generation.

### Features
- AI-powered type guard generation
- Zero configuration setup
- 6 comprehensive tools
- TypeScript integration
- Runtime validation

### Installation
```bash
npm install -g guardz-generator-mcp
```

### Configuration
Add to Cursor's MCP configuration:
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

### Links
- npm: https://www.npmjs.com/package/guardz-generator-mcp
- GitHub: https://github.com/thiennp/guardz-generator-mcp
```

---

## 🎯 **Claude Desktop Directory**

### **Claude Desktop MCP Directory**
- **URL**: https://claude.ai/desktop
- **Process**: Submit through Claude Desktop settings
- **Category**: Development Tools

### **Submission Template**
```markdown
## guardz-generator-mcp for Claude Desktop

### Server Name
guardz-generator-mcp

### Description
AI-powered TypeScript type guard generation server for Claude Desktop

### Installation
```bash
npm install -g guardz-generator-mcp
```

### Configuration
Add to Claude Desktop's mcp_servers.json:
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

### Usage
Ask Claude to generate type guards:
"Generate type guards for the User interface in my project"

### Features
- 6 AI-powered tools
- TypeScript integration
- Runtime validation
- Zero configuration
```

---

## 🎯 **VS Code Marketplace**

### **VS Code Extension**
- **URL**: https://marketplace.visualstudio.com/
- **Process**: Create VS Code extension
- **Category**: Developer Tools

### **Extension Template**
```json
{
  "name": "guardz-generator-mcp",
  "displayName": "Guardz Generator MCP",
  "description": "AI-powered TypeScript type guard generation using MCP",
  "version": "1.0.1",
  "publisher": "thiennp",
  "engines": {
    "vscode": "^1.60.0"
  },
  "categories": [
    "Developer Tools",
    "TypeScript",
    "Other"
  ],
  "keywords": [
    "typescript",
    "type-guard",
    "mcp",
    "ai",
    "code-generation"
  ],
  "activationEvents": [
    "onCommand:guardz-generator.generateTypeGuards"
  ],
  "main": "./dist/extension.js",
  "contributes": {
    "commands": [
      {
        "command": "guardz-generator.generateTypeGuards",
        "title": "Generate Type Guards"
      }
    ]
  }
}
```

---

## 🎯 **AI Tools Directories**

### **1. FutureTools.io**
- **URL**: https://futuretools.io/
- **Category**: Developer Tools
- **Submission**: Contact via website

### **2. There's An AI For That**
- **URL**: https://theresanaiforthat.com/
- **Category**: Development
- **Submission**: Submit tool through website

### **3. AI Tools Directory**
- **URL**: https://aitoolsdirectory.com/
- **Category**: Developer Tools
- **Submission**: Contact via email

### **4. Product Hunt**
- **URL**: https://producthunt.com/
- **Category**: Developer Tools
- **Submission**: Submit product for launch

### **5. AlternativeTo**
- **URL**: https://alternativeto.net/
- **Category**: Developer Tools
- **Submission**: Add alternative listing

---

## 🎯 **GitHub Topics & Discovery**

### **GitHub Topics**
Add these topics to your repository:
- `mcp`
- `model-context-protocol`
- `typescript`
- `type-guard`
- `code-generation`
- `ai-tools`
- `developer-tools`
- `runtime-validation`
- `claude-desktop`
- `cursor-ide`

### **GitHub Actions for Discovery**
```yaml
name: Update Repository Topics
on:
  push:
    branches: [main]
jobs:
  update-topics:
    runs-on: ubuntu-latest
    steps:
      - name: Update topics
        run: |
          gh repo edit --add-topic mcp,model-context-protocol,typescript,type-guard,code-generation,ai-tools,developer-tools,runtime-validation,claude-desktop,cursor-ide
```

---

## 🎯 **NPM Discovery**

### **NPM Keywords**
Update package.json keywords:
```json
{
  "keywords": [
    "mcp",
    "model-context-protocol",
    "guardz-generator",
    "typescript",
    "type-guard",
    "code-generation",
    "runtime-validation",
    "type-safety",
    "ai-tools",
    "developer-tools",
    "claude-desktop",
    "cursor-ide",
    "vscode-extension"
  ]
}
```

---

## 🎯 **Documentation Sites**

### **1. MCP Documentation**
- **URL**: https://modelcontextprotocol.io/
- **Process**: Add to official documentation
- **Category**: Tools & Servers

### **2. TypeScript Documentation**
- **URL**: https://www.typescriptlang.org/
- **Process**: Community contributions
- **Category**: Tools & Libraries

### **3. Claude Documentation**
- **URL**: https://docs.anthropic.com/
- **Process**: Community examples
- **Category**: MCP Tools

---

## 📊 **Submission Checklist**

### **Week 1: Core Platforms**
- [ ] MCP Registry (GitHub PR)
- [ ] Cursor IDE Marketplace
- [ ] Claude Desktop Directory
- [ ] GitHub Topics Update

### **Week 2: AI Directories**
- [ ] FutureTools.io
- [ ] There's An AI For That
- [ ] AI Tools Directory
- [ ] Product Hunt

### **Week 3: Developer Platforms**
- [ ] VS Code Marketplace
- [ ] NPM Discovery
- [ ] AlternativeTo
- [ ] Documentation Sites

### **Week 4: Community**
- [ ] TypeScript Community
- [ ] MCP Community
- [ ] AI Developer Communities
- [ ] Open Source Directories

---

## 🚀 **Ready to Submit!**

All templates and configurations are ready. Start with the MCP Registry submission and work through the checklist systematically.

**Priority Order:**
1. **MCP Registry** (highest impact)
2. **Cursor IDE Marketplace** (direct integration)
3. **Claude Desktop Directory** (target audience)
4. **GitHub Topics** (discovery)
5. **AI Tools Directories** (broader reach) 