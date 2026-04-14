#!/usr/bin/env node
/**
 * Shell 命令执行前完整钩子（增强版）
 *
 * 合并了 Claude Code 中所有 Bash PreToolUse 钩子：
 * 1. dev server 拦截（强制 tmux）— standard/strict
 * 2. auto-tmux-dev — 自动在 tmux 中启动 dev server — standard/strict
 * 3. tmux 提醒 — strict
 * 4. git push 审查提醒 — strict
 * 5. 提交质量检查 — strict
 * 6. 治理事件捕获 — standard/strict（需 ECC_GOVERNANCE_CAPTURE=1）
 * 7. InsAIts 安全监控 — standard/strict（需 ECC_ENABLE_INSAITS=1）
 */
const { readStdin, hookEnabled, runExistingHook, transformToClaude } = require('./adapter');
const { splitShellSegments } = require('../ecc-scripts/lib/shell-split');

readStdin()
  .then(raw => {
    try {
      const input = JSON.parse(raw || '{}');
      const cmd = String(input.command || input.args?.command || '');

      // 1. dev server 拦截
      if (hookEnabled('pre:bash:dev-server-block', ['standard', 'strict']) && process.platform !== 'win32') {
        const segments = splitShellSegments(cmd);
        const tmuxLauncher = /^\s*tmux\s+(new|new-session|new-window|split-window)\b/;
        const devPattern = /\b(npm\s+run\s+dev|pnpm(?:\s+run)?\s+dev|yarn\s+dev|bun\s+run\s+dev)\b/;
        const hasBlockedDev = segments.some(segment => devPattern.test(segment) && !tmuxLauncher.test(segment));
        if (hasBlockedDev) {
          console.error('[ECC] 已阻止: Dev server 必须在 tmux 中运行');
          console.error('[ECC] 使用: tmux new-session -d -s dev "npm run dev"');
          process.exit(2);
        }
      }

      // 2. auto-tmux-dev
      if (hookEnabled('pre:bash:auto-tmux-dev', ['standard', 'strict'])) {
        const claudeInput = transformToClaude(input);
        runExistingHook('auto-tmux-dev.js', claudeInput);
      }

      // 3. tmux 提醒
      if (
        hookEnabled('pre:bash:tmux-reminder', ['strict']) &&
        process.platform !== 'win32' &&
        !process.env.TMUX &&
        /(npm (install|test)|pnpm (install|test)|yarn (install|test)?|bun (install|test)|cargo build|make\b|docker\b|pytest|vitest|playwright)/.test(cmd)
      ) {
        console.error('[ECC] 建议在 tmux 中运行以保持会话持久性');
      }

      // 4. git push 审查提醒
      if (hookEnabled('pre:bash:git-push-reminder', ['strict']) && /\bgit\s+push\b/.test(cmd)) {
        console.error('[ECC] 推送前请审查变更: git diff origin/main...HEAD');
      }

      // 5. 提交质量检查
      if (hookEnabled('pre:bash:commit-quality', ['strict']) && /\bgit\s+commit\b/.test(cmd)) {
        const claudeInput = transformToClaude(input);
        runExistingHook('pre-bash-commit-quality.js', claudeInput);
      }

      // 6. 治理事件捕获
      if (hookEnabled('pre:governance-capture', ['standard', 'strict'])) {
        const claudeInput = transformToClaude(input);
        runExistingHook('governance-capture.js', JSON.stringify(claudeInput));
      }

      // 7. InsAIts 安全监控
      if (hookEnabled('pre:insaits-security', ['standard', 'strict'])) {
        const claudeInput = transformToClaude(input);
        runExistingHook('insaits-security-wrapper.js', JSON.stringify(claudeInput));
      }
    } catch {
      // noop
    }

    process.stdout.write(raw);
  })
  .catch(() => process.exit(0));
