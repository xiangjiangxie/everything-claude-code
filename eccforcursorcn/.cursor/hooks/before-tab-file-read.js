#!/usr/bin/env node
/**
 * Tab 文件读取前钩子
 *
 * 阻止 Cursor Tab 功能读取敏感文件。
 * 匹配 .env / .key / .pem / credentials / secret 等文件。
 * 检测到敏感文件时以 exit code 2 退出，阻止读取操作。
 */
const { readStdin } = require('./adapter');
readStdin().then(raw => {
  try {
    const input = JSON.parse(raw);
    const filePath = input.path || input.file || '';
    if (/\.(env|key|pem)$|\.env\.|credentials|secret/i.test(filePath)) {
      console.error('[ECC] 已阻止: Tab 不能读取敏感文件: ' + filePath);
      process.exit(2);
    }
  } catch {}
  process.stdout.write(raw);
}).catch(() => process.exit(0));
