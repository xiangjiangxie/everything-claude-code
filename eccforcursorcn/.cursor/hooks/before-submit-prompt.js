#!/usr/bin/env node
/**
 * 提交提示词前钩子
 *
 * 在用户提交提示词给 AI 之前检查内容中是否包含敏感信息。
 * 检测模式包括：OpenAI API Key、GitHub Token、AWS Key、Slack Token、私钥等。
 */
const { readStdin } = require('./adapter');
readStdin().then(raw => {
  try {
    const input = JSON.parse(raw);
    const prompt = input.prompt || input.content || input.message || '';
    // 密钥检测模式列表
    const secretPatterns = [
      /sk-[a-zA-Z0-9]{20,}/,       // OpenAI API 密钥
      /ghp_[a-zA-Z0-9]{36,}/,      // GitHub 个人访问令牌
      /AKIA[A-Z0-9]{16}/,          // AWS 访问密钥
      /xox[bpsa]-[a-zA-Z0-9-]+/,   // Slack 令牌
      /-----BEGIN (RSA |EC )?PRIVATE KEY-----/, // 私钥
    ];
    for (const pattern of secretPatterns) {
      if (pattern.test(prompt)) {
        console.error('[ECC] 警告: 检测到提示词中可能包含密钥!');
        console.error('[ECC] 请移除密钥后再提交，使用环境变量替代。');
        break;
      }
    }
  } catch {}
  process.stdout.write(raw);
}).catch(() => process.exit(0));
