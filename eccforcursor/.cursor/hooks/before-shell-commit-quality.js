#!/usr/bin/env node
/**
 * 提交质量检查钩子
 *
 * 在 git commit 命令执行前检查：
 * - staged 文件是否通过 lint
 * - 提交信息格式是否正确
 * - 是否残留 console.log/debugger/密钥
 *
 * 仅在 strict 模式下启用。
 */
const { readStdin, runExistingHook, transformToClaude, hookEnabled } = require('./adapter');
readStdin().then(raw => {
  try {
    const input = JSON.parse(raw || '{}');
    const cmd = String(input.command || input.args?.command || '');
    if (hookEnabled('pre:bash:commit-quality', ['strict']) && /\bgit\s+commit\b/.test(cmd)) {
      const claudeInput = transformToClaude(input);
      runExistingHook('pre-bash-commit-quality.js', claudeInput);
    }
  } catch {}
  process.stdout.write(raw);
}).catch(() => process.exit(0));
