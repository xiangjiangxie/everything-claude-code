#!/usr/bin/env node
/**
 * Shell 命令执行后完整钩子（增强版）
 *
 * 合并了 Claude Code 中所有 Bash PostToolUse 钩子：
 * 1. PR URL 记录
 * 2. 构建完成通知
 * 3. 治理事件捕获 — standard/strict
 */
const { readStdin, hookEnabled, runExistingHook, transformToClaude } = require('./adapter');

readStdin().then(raw => {
  try {
    const input = JSON.parse(raw || '{}');
    const cmd = String(input.command || input.args?.command || '');
    const output = String(input.output || input.result || '');

    // PR URL 记录
    if (hookEnabled('post:bash:pr-created', ['standard', 'strict']) && /\bgh\s+pr\s+create\b/.test(cmd)) {
      const m = output.match(/https:\/\/github\.com\/[^/]+\/[^/]+\/pull\/\d+/);
      if (m) {
        console.error('[ECC] PR 已创建: ' + m[0]);
        const repo = m[0].replace(/https:\/\/github\.com\/([^/]+\/[^/]+)\/pull\/\d+/, '$1');
        const pr = m[0].replace(/.+\/pull\/(\d+)/, '$1');
        console.error('[ECC] 审查命令: gh pr review ' + pr + ' --repo ' + repo);
      }
    }

    // 构建完成通知
    if (hookEnabled('post:bash:build-complete', ['standard', 'strict']) && /(npm run build|pnpm build|yarn build)/.test(cmd)) {
      const claudeInput = transformToClaude(input);
      runExistingHook('post-bash-build-complete.js', JSON.stringify(claudeInput));
    }

    // 治理事件捕获
    if (hookEnabled('post:governance-capture', ['standard', 'strict'])) {
      const claudeInput = transformToClaude(input);
      runExistingHook('governance-capture.js', JSON.stringify(claudeInput));
    }
  } catch {
    // noop
  }

  process.stdout.write(raw);
}).catch(() => process.exit(0));
