#!/usr/bin/env node
/**
 * 文件读取前钩子
 *
 * 当 AI 读取文件时检查是否为敏感文件（.env / .key / .pem / credentials 等），
 * 发出警告但不阻止读取（区别于 before-tab-file-read 的阻止行为）。
 */
const { readStdin } = require('./adapter');
readStdin().then(raw => {
  try {
    const input = JSON.parse(raw);
    const filePath = input.path || input.file || '';
    if (/\.(env|key|pem)$|\.env\.|credentials|secret/i.test(filePath)) {
      console.error('[ECC] 警告: 正在读取敏感文件: ' + filePath);
      console.error('[ECC] 请确保此数据不会暴露在输出中');
    }
  } catch {}
  process.stdout.write(raw);
}).catch(() => process.exit(0));
