#!/usr/bin/env node
/**
 * Shell 命令执行前钩子
 *
 * 在 Cursor 执行 Shell 命令前触发，提供三层防护：
 * 1. 拦截裸 dev server 启动（强制使用 tmux，仅 standard/strict）
 * 2. tmux 提醒（仅 strict）
 * 3. git push 前审查提醒（仅 strict）
 */
const { readStdin, hookEnabled } = require('./adapter');
const { splitShellSegments } = require('../ecc-scripts/lib/shell-split');

readStdin()
  .then(raw => {
    try {
      const input = JSON.parse(raw || '{}');
      const cmd = String(input.command || input.args?.command || '');

      if (hookEnabled('pre:bash:dev-server-block', ['standard', 'strict']) && process.platform !== 'win32') {
        const segments = splitShellSegments(cmd);
        const tmuxLauncher = /^\s*tmux\s+(new|new-session|new-window|split-window)\b/;
        const devPattern = /\b(npm\s+run\s+dev|pnpm(?:\s+run)?\s+dev|yarn\s+dev|bun\s+run\s+dev)\b/;
        const hasBlockedDev = segments.some(segment => devPattern.test(segment) && !tmuxLauncher.test(segment));
        if (hasBlockedDev) {
          console.error('[ECC] 已阻止: Dev server 必须在 tmux 中运行以便访问日志');
          console.error('[ECC] 使用: tmux new-session -d -s dev "npm run dev"');
          process.exit(2);
        }
      }

      if (
        hookEnabled('pre:bash:tmux-reminder', ['strict']) &&
        process.platform !== 'win32' &&
        !process.env.TMUX &&
        /(npm (install|test)|pnpm (install|test)|yarn (install|test)?|bun (install|test)|cargo build|make\b|docker\b|pytest|vitest|playwright)/.test(cmd)
      ) {
        console.error('[ECC] 建议在 tmux 中运行以保持会话持久性');
      }

      if (hookEnabled('pre:bash:git-push-reminder', ['strict']) && /\bgit\s+push\b/.test(cmd)) {
        console.error('[ECC] 推送前请审查变更: git diff origin/main...HEAD');
      }
    } catch {
      // noop
    }

    process.stdout.write(raw);
  })
  .catch(() => process.exit(0));
