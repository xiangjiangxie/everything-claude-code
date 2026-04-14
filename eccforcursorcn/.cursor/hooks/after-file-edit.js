#!/usr/bin/env node
/**
 * 文件编辑后钩子
 *
 * 在 Cursor 编辑文件后触发，依次执行三个检查：
 * 1. 自动格式化（Biome 或 Prettier）
 * 2. TypeScript 类型检查（仅 .ts/.tsx 文件）
 * 3. console.log 残留警告（仅 JS/TS 文件）
 */
const { readStdin, runExistingHook, transformToClaude } = require('./adapter');
readStdin().then(raw => {
  try {
    const input = JSON.parse(raw);
    const claudeInput = transformToClaude(input, {
      tool_input: { file_path: input.path || input.file || '' }
    });
    const claudeStr = JSON.stringify(claudeInput);

    // 依次运行：格式化 → 类型检查 → console.log 警告
    runExistingHook('post-edit-format.js', claudeStr);
    runExistingHook('post-edit-typecheck.js', claudeStr);
    runExistingHook('post-edit-console-warn.js', claudeStr);
  } catch {}
  process.stdout.write(raw);
}).catch(() => process.exit(0));
