#!/usr/bin/env node
/**
 * Shell 命令执行后钩子
 *
 * 在 Shell 命令执行完成后触发：
 * 1. 检测 gh pr create 的输出，记录 PR URL
 * 2. 检测 build 命令完成，发出通知
 */
const { readStdin, hookEnabled } = require('./adapter');

readStdin().then(raw => {
  try {
    const input = JSON.parse(raw || '{}');
    const cmd = String(input.command || input.args?.command || '');
    const output = String(input.output || input.result || '');

    if (hookEnabled('post:bash:pr-created', ['standard', 'strict']) && /\bgh\s+pr\s+create\b/.test(cmd)) {
      const m = output.match(/https:\/\/github\.com\/[^/]+\/[^/]+\/pull\/\d+/);
      if (m) {
        console.error('[ECC] PR 已创建: ' + m[0]);
        const repo = m[0].replace(/https:\/\/github\.com\/([^/]+\/[^/]+)\/pull\/\d+/, '$1');
        const pr = m[0].replace(/.+\/pull\/(\d+)/, '$1');
        console.error('[ECC] 审查命令: gh pr review ' + pr + ' --repo ' + repo);
      }
    }

    if (hookEnabled('post:bash:build-complete', ['standard', 'strict']) && /(npm run build|pnpm build|yarn build)/.test(cmd)) {
      console.error('[ECC] 构建完成');
    }
  } catch {
    // noop
  }

  process.stdout.write(raw);
}).catch(() => process.exit(0));
