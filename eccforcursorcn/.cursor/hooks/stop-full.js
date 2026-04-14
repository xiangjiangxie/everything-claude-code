#!/usr/bin/env node
/**
 * 停止钩子完整版（增强版）
 *
 * 合并了 Claude Code 中所有 Stop 钩子：
 * 1. console.log 审计 — standard/strict
 * 2. 会话保存 — 所有级别
 * 3. 模式评估 — 所有级别
 * 4. 成本追踪 — 所有级别
 * 5. 桌面通知 — standard/strict（仅 macOS）
 */
const { readStdin, runExistingHook, transformToClaude, hookEnabled } = require('./adapter');
readStdin().then(raw => {
  const input = JSON.parse(raw || '{}');
  const claudeInput = transformToClaude(input);

  // 1. console.log 残留检查
  if (hookEnabled('stop:check-console-log', ['standard', 'strict'])) {
    runExistingHook('check-console-log.js', claudeInput);
  }
  // 2. 会话状态保存
  if (hookEnabled('stop:session-end', ['minimal', 'standard', 'strict'])) {
    runExistingHook('session-end.js', claudeInput);
  }
  // 3. 会话模式评估
  if (hookEnabled('stop:evaluate-session', ['minimal', 'standard', 'strict'])) {
    runExistingHook('evaluate-session.js', claudeInput);
  }
  // 4. 使用成本追踪
  if (hookEnabled('stop:cost-tracker', ['minimal', 'standard', 'strict'])) {
    runExistingHook('cost-tracker.js', claudeInput);
  }
  // 5. 桌面通知（仅 macOS）
  if (hookEnabled('stop:desktop-notify', ['standard', 'strict'])) {
    runExistingHook('desktop-notify.js', claudeInput);
  }

  process.stdout.write(raw);
}).catch(() => process.exit(0));
