#!/usr/bin/env node
/**
 * 子智能体启动钩子
 *
 * 当 Cursor 启动子智能体时记录日志，用于可观测性监控。
 */
const { readStdin } = require('./adapter');
readStdin().then(raw => {
  try {
    const input = JSON.parse(raw);
    const agent = input.agent_name || input.agent || 'unknown';
    console.error(`[ECC] 智能体已启动: ${agent}`);
  } catch {}
  process.stdout.write(raw);
}).catch(() => process.exit(0));
