#!/usr/bin/env node
/**
 * 会话结束钩子
 *
 * 在 Cursor 会话结束时触发。
 * 标记会话结束，所有配置级别均启用。
 */
const { readStdin, runExistingHook, transformToClaude, hookEnabled } = require('./adapter');
readStdin().then(raw => {
  const input = JSON.parse(raw || '{}');
  const claudeInput = transformToClaude(input);
  if (hookEnabled('session:end:marker', ['minimal', 'standard', 'strict'])) {
    runExistingHook('session-end-marker.js', claudeInput);
  }
  process.stdout.write(raw);
}).catch(() => process.exit(0));
