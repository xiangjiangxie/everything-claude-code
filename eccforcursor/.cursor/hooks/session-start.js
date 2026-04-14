#!/usr/bin/env node
/**
 * 会话启动钩子
 *
 * 在 Cursor 新会话启动时触发。加载上次会话的上下文信息，
 * 检测项目类型和包管理器，为 AI 提供持续的工作记忆。
 *
 * 所有配置级别均启用此钩子（minimal/standard/strict）。
 */
const { readStdin, runExistingHook, transformToClaude, hookEnabled } = require('./adapter');
readStdin().then(raw => {
  const input = JSON.parse(raw || '{}');
  const claudeInput = transformToClaude(input);
  if (hookEnabled('session:start', ['minimal', 'standard', 'strict'])) {
    runExistingHook('session-start.js', claudeInput);
  }
  process.stdout.write(raw);
}).catch(() => process.exit(0));
