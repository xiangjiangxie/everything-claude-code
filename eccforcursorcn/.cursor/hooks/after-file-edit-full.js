#!/usr/bin/env node
/**
 * 文件编辑后完整钩子（增强版）
 *
 * 在原有三项检查基础上，增加了 Claude Code 中的额外功能：
 * 1. 自动格式化（Biome/Prettier）
 * 2. TypeScript 类型检查
 * 3. console.log 警告
 * 4. 质量门禁检查（quality-gate）— standard/strict
 * 5. 上下文压缩建议 — standard/strict
 * 6. 配置保护 — standard/strict
 * 7. 治理事件捕获（governance-capture）— standard/strict（需 ECC_GOVERNANCE_CAPTURE=1）
 */
const { readStdin, runExistingHook, transformToClaude, hookEnabled } = require('./adapter');
readStdin().then(raw => {
  try {
    const input = JSON.parse(raw);
    const claudeInput = transformToClaude(input, {
      tool_input: { file_path: input.path || input.file || '' }
    });
    const claudeStr = JSON.stringify(claudeInput);

    // 原有功能
    runExistingHook('post-edit-format.js', claudeStr);
    runExistingHook('post-edit-typecheck.js', claudeStr);
    runExistingHook('post-edit-console-warn.js', claudeStr);

    // 新增：质量门禁
    if (hookEnabled('post:quality-gate', ['standard', 'strict'])) {
      runExistingHook('quality-gate.js', claudeStr);
    }
    // 新增：上下文压缩建议
    if (hookEnabled('pre:edit-write:suggest-compact', ['standard', 'strict'])) {
      runExistingHook('suggest-compact.js', claudeStr);
    }
    // 新增：配置保护
    if (hookEnabled('pre:config-protection', ['standard', 'strict'])) {
      runExistingHook('config-protection.js', claudeStr);
    }
    // 新增：治理事件捕获
    if (hookEnabled('post:governance-capture', ['standard', 'strict'])) {
      runExistingHook('governance-capture.js', claudeStr);
    }
  } catch {}
  process.stdout.write(raw);
}).catch(() => process.exit(0));
