#!/usr/bin/env node
/**
 * 上下文压缩前钩子
 *
 * 在 Cursor 压缩上下文之前触发，保存当前工作状态，
 * 防止重要信息在上下文压缩过程中丢失。
 */
const { readStdin, runExistingHook, transformToClaude } = require('./adapter');
readStdin().then(raw => {
  const claudeInput = JSON.parse(raw || '{}');
  runExistingHook('pre-compact.js', transformToClaude(claudeInput));
  process.stdout.write(raw);
}).catch(() => process.exit(0));
