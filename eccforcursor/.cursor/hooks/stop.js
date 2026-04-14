#!/usr/bin/env node
/**
 * 停止钩子（每次 AI 响应结束后触发）
 *
 * 执行四个收尾任务：
 * 1. console.log 审计 — 检查修改的文件中是否残留 console.log（standard/strict）
 * 2. 会话保存 — 提取摘要并保存到会话文件（所有级别）
 * 3. 模式评估 — 分析会话是否有可提取的开发模式（所有级别）
 * 4. 成本追踪 — 记录 token 使用量和估算成本（所有级别）
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

  process.stdout.write(raw);
}).catch(() => process.exit(0));
