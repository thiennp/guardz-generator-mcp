#!/usr/bin/env node

/**
 * Automated Outreach Script for guardz-generator-mcp
 * This script helps automate some community outreach tasks
 */

import fs from 'fs';
import path from 'path';

// Read the social media templates
const socialMediaPosts = fs.readFileSync('social-media-posts.md', 'utf8');
const communityEngagement = fs.readFileSync('community-engagement.md', 'utf8');

// Extract posts
const twitterPost = socialMediaPosts.match(/## Twitter\/X Post\n```\n([\s\S]*?)\n```/)?.[1];
const linkedinPost = socialMediaPosts.match(/## LinkedIn Post\n```\n([\s\S]*?)\n```/)?.[1];
const redditPost = socialMediaPosts.match(/## Reddit Post.*?\n```\n([\s\S]*?)\n```/)?.[1];
const hackerNewsPost = socialMediaPosts.match(/## Hacker News Post\n```\n([\s\S]*?)\n```/)?.[1];

console.log('🤖 Automated Outreach Script for guardz-generator-mcp');
console.log('==================================================\n');

console.log('📋 Ready-to-use Social Media Posts:');
console.log('====================================\n');

if (twitterPost) {
  console.log('🐦 Twitter/X Post:');
  console.log(twitterPost);
  console.log('\n---\n');
}

if (linkedinPost) {
  console.log('💼 LinkedIn Post:');
  console.log(linkedinPost);
  console.log('\n---\n');
}

if (redditPost) {
  console.log('📱 Reddit Post:');
  console.log(redditPost);
  console.log('\n---\n');
}

if (hackerNewsPost) {
  console.log('📰 Hacker News Post:');
  console.log(hackerNewsPost);
  console.log('\n---\n');
}

console.log('📊 Package Statistics:');
console.log('=====================');
console.log('📦 npm package: guardz-generator-mcp');
console.log('🔗 GitHub: https://github.com/thiennp/guardz-generator-mcp');
console.log('📖 Documentation: https://github.com/thiennp/guardz-generator-mcp#readme');
console.log('🎯 MCP Clients: 30+ compatible clients');
console.log('⭐ License: MIT');

console.log('\n🚀 Next Steps:');
console.log('==============');
console.log('1. Copy and paste the social media posts above');
console.log('2. Submit to MCP ecosystem using mcp-examples-submission.md');
console.log('3. Join Discord communities using community-engagement.md');
console.log('4. Answer Stack Overflow questions using the template');
console.log('5. Create GitHub issues using github-issues.md');

console.log('\n📈 Expected Results:');
console.log('===================');
console.log('• GitHub stars: 50-200+');
console.log('• npm downloads: 100-500+ monthly');
console.log('• Community recognition');
console.log('• Developer adoption');

console.log('\n✅ All materials are ready in the repository!');
console.log('📁 Files created:');
console.log('  • social-media-posts.md');
console.log('  • community-engagement.md');
console.log('  • mcp-examples-submission.md');
console.log('  • demo-website-idea.md');
console.log('  • github-issues.md');
console.log('  • automated-outreach.js');

console.log('\n🎯 Ready to inform the AI community! 🚀'); 