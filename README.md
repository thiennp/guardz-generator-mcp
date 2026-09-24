# Guardz Generator MCP Server

MCP server that turns TypeScript types into [guardz](https://github.com/thiennp/guardz) runtime guards. Generation stays in `guardz-generator`. This package is the agent interface: preview the source, write it only when asked, and report guards that are missing or stale.

## Tools

| Tool | What it does |
| --- | --- |
| `preview_type_guard` | Returns guard source for files or a snippet. Writes nothing. |
| `apply_type_guards` | Writes `is<Type>.guardz.ts` next to the source. Does not run lint, Prettier, or `tsc`. |
| `audit_type_guards` | Lists exports whose guard file is missing or different from a fresh generation. |
| `explain_type` | Lists the members a guard will check and constructs the generator cannot represent (`any`, conditional types, `infer`, `typeof`). |

Prompt `add-runtime-guard` tells the agent to audit, preview, explain limitations, and apply only the type you named.

## Setup

Node.js 18+.

Cursor or Claude Desktop:

```json
{
  "mcpServers": {
    "guardz-generator": {
      "command": "npx",
      "args": ["-y", "guardz-generator-mcp"]
    }
  }
}
```

The same block is in `mcp-config-example.json`.

## Check drift from the CLI

```bash
npx guardz-generator-mcp check src/types/user.ts
```

Exit code `1` means a guard is missing or stale. The JSON report matches `audit_type_guards`.

## Development

```bash
npm install
npm test
npm run build
```

`npm test` compares generated guards with fixtures for primitives, optional fields, unions, generics, recursion, and cross-file references, and drives each MCP tool through an in-memory client.
