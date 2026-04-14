#!/usr/bin/env node
/**
 * 文件写入前钩子
 *
 * 综合了 Claude Code 中多个 Write 相关的 PreToolUse 钩子：
 * 1. 文档文件警告 — 写入非标准文档文件时发出警告（standard/strict）
 * 2. 上下文压缩建议 — 在逻辑间隔建议手动压缩（standard/strict）
 * 3. 配置保护 — 阻止修改 linter/formatter 配置文件（standard/strict）
 */
const { readStdin, runExistingHook, transformToClaude, hookEnabled } = require('./adapter');
readStdin().then(raw => {
  try {
    const input = JSON.parse(raw || '{}');
    const claudeInput = transformToClaude(input, {
      tool_input: { file_path: input.path || input.file || '' }
    });
    const claudeStr = JSON.stringify(claudeInput);

    // 文档文件警告
    if (hookEnabled('pre:write:doc-file-warning', ['standard', 'strict'])) {
      runExistingHook('doc-file-warning.js', claudeStr);
    }
    // 建议上下文压缩
    if (hookEnabled('pre:edit-write:suggest-compact', ['standard', 'strict'])) {
      runExistingHook('suggest-compact.js', claudeStr);
    }
    // 配置文件保护
    if (hookEnabled('pre:config-protection', ['standard', 'strict'])) {
      runExistingHook('config-protection.js', claudeStr);
    }
  } catch {}
  process.stdout.write(raw);
}).catch(() => process.exit(0));
