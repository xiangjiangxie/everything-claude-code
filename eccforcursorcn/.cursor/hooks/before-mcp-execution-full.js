#!/usr/bin/env node
/**
 * MCP 调用前完整钩子（增强版）
 *
 * 合并了 Claude Code 中的 MCP 相关功能：
 * 1. MCP 调用审计日志
 * 2. MCP 服务器健康检查 — standard/strict
 */
const { readStdin, hookEnabled, runExistingHook, transformToClaude } = require('./adapter');
readStdin().then(raw => {
  try {
    const input = JSON.parse(raw);
    const server = input.server || input.mcp_server || 'unknown';
    const tool = input.tool || input.mcp_tool || 'unknown';
    console.error(`[ECC] MCP 调用: ${server}/${tool}`);

    // MCP 健康检查
    if (hookEnabled('pre:mcp-health-check', ['standard', 'strict'])) {
      const claudeInput = transformToClaude(input);
      runExistingHook('mcp-health-check.js', JSON.stringify(claudeInput));
    }
  } catch {}
  process.stdout.write(raw);
}).catch(() => process.exit(0));
