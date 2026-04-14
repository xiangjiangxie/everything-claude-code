#!/usr/bin/env node
/**
 * MCP 调用前钩子
 *
 * 在 MCP 服务器工具调用前记录审计日志。
 * 输出格式：[ECC] MCP 调用: 服务器名/工具名
 */
const { readStdin } = require('./adapter');
readStdin().then(raw => {
  try {
    const input = JSON.parse(raw);
    const server = input.server || input.mcp_server || 'unknown';
    const tool = input.tool || input.mcp_tool || 'unknown';
    console.error(`[ECC] MCP 调用: ${server}/${tool}`);
  } catch {}
  process.stdout.write(raw);
}).catch(() => process.exit(0));
