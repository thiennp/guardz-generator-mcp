#!/bin/bash

# GitHub Issues Creation Script for guardz-generator-mcp
# This script creates GitHub issues for community engagement

echo "🔧 Creating GitHub Issues for Community Engagement..."
echo "=================================================="

# Check if gh CLI is installed
if ! command -v gh &> /dev/null; then
    echo "❌ GitHub CLI (gh) is not installed. Please install it first:"
    echo "   https://cli.github.com/"
    exit 1
fi

# Check if user is authenticated
if ! gh auth status &> /dev/null; then
    echo "❌ Not authenticated with GitHub. Please run: gh auth login"
    exit 1
fi

echo "✅ GitHub CLI is ready!"

# Create Issue 1: Submit to MCP Ecosystem
echo "📝 Creating Issue: Submit to MCP Ecosystem..."
gh issue create \
  --title "Submit guardz-generator-mcp to MCP ecosystem" \
  --body "Submit the guardz-generator-mcp server to the MCP ecosystem for discoverability.

## Tasks
- [ ] Create pull request to modelcontextprotocol/modelcontextprotocol
- [ ] Add to examples page
- [ ] Update documentation with installation instructions
- [ ] Add to MCP clients compatibility list

## Resources
- Submission template: \`mcp-examples-submission.md\`
- Repository: https://github.com/thiennp/guardz-generator-mcp
- npm package: https://www.npmjs.com/package/guardz-generator-mcp

## Labels
enhancement, documentation, community" \
  --label "enhancement" \
  --label "documentation" \
  --label "community"

# Create Issue 2: Create Demo Website
echo "📝 Creating Issue: Create Demo Website..."
gh issue create \
  --title "Create interactive demo website" \
  --body "Create a web-based demo that showcases the type guard generation capabilities.

## Tasks
- [ ] Set up Next.js project
- [ ] Create live TypeScript editor
- [ ] Implement type guard generation preview
- [ ] Add MCP client integration examples
- [ ] Deploy to Vercel/Netlify

## Resources
- Demo website idea: \`demo-website-idea.md\`
- Technology stack: React/Next.js, Tailwind CSS
- Deployment: Vercel/Netlify

## Labels
enhancement, documentation, demo" \
  --label "enhancement" \
  --label "documentation" \
  --label "demo"

# Create Issue 3: Social Media Campaign
echo "📝 Creating Issue: Execute Social Media Campaign..."
gh issue create \
  --title "Execute social media campaign" \
  --body "Share the MCP server across social media platforms to increase visibility.

## Tasks
- [ ] Post on Twitter/X using template from \`social-media-posts.md\`
- [ ] Share on LinkedIn using professional post
- [ ] Submit to Reddit (r/typescript, r/javascript)
- [ ] Post on Hacker News as \"Show HN\"
- [ ] Engage with community responses

## Resources
- Social media templates: \`social-media-posts.md\`
- Community engagement scripts: \`community-engagement.md\"

## Labels
marketing, community" \
  --label "marketing" \
  --label "community"

# Create Issue 4: Community Engagement
echo "📝 Creating Issue: Engage with Developer Communities..."
gh issue create \
  --title "Engage with developer communities" \
  --body "Actively engage with TypeScript and MCP communities to promote the tool.

## Tasks
- [ ] Join MCP Discord server
- [ ] Join TypeScript Discord server
- [ ] Answer Stack Overflow questions using template
- [ ] Write blog post for Dev.to
- [ ] Submit conference talk proposals

## Resources
- Discord messages: \`community-engagement.md\`
- Stack Overflow template: \`community-engagement.md\`
- Blog post outline: \`community-engagement.md\"

## Labels
community, documentation" \
  --label "community" \
  --label "documentation"

echo "✅ All GitHub issues created successfully!"
echo "📋 View issues at: https://github.com/thiennp/guardz-generator-mcp/issues" 