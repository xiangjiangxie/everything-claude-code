#!/usr/bin/env node
/**
 * 子智能体完成钩子
 *
 * 当 Cursor 的子智能体执行完毕时记录日志。
 */
const { readStdin } = require('./adapter');
readStdin().then(raw => {
  try {
    const input = JSON.parse(raw);
    const agent = input.agent_name || input.agent || 'unknown';
    console.error(`[ECC] 智能体已完成: ${agent}`);
  } catch {}
  process.stdout.write(raw);
}).catch(() => process.exit(0));
