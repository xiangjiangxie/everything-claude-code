#!/usr/bin/env node
/**
 * Tab 编辑后钩子
 *
 * 当 Cursor Tab 功能编辑了文件后，自动触发格式化。
 */
const { readStdin, runExistingHook, transformToClaude } = require('./adapter');
readStdin().then(raw => {
  try {
    const input = JSON.parse(raw);
    const claudeInput = transformToClaude(input, {
      tool_input: { file_path: input.path || input.file || '' }
    });
    runExistingHook('post-edit-format.js', JSON.stringify(claudeInput));
  } catch {}
  process.stdout.write(raw);
}).catch(() => process.exit(0));
