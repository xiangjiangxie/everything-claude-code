#!/usr/bin/env node
/**
 * MCP 调用后钩子
 *
 * MCP 工具调用完成后记录结果。
 * 输出格式：[ECC] MCP 结果: 服务器名/工具名 - 成功/失败
 */
const { readStdin } = require('./adapter');
readStdin().then(raw => {
  try {
    const input = JSON.parse(raw);
    const server = input.server || input.mcp_server || 'unknown';
    const tool = input.tool || input.mcp_tool || 'unknown';
    const success = input.error ? '失败' : '成功';
    console.error(`[ECC] MCP 结果: ${server}/${tool} - ${success}`);
  } catch {}
  process.stdout.write(raw);
}).catch(() => process.exit(0));
