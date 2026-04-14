---
description: "TypeScript 安全，扩展通用规则"
globs: ["**/*.ts", "**/*.tsx", "**/*.js", "**/*.jsx"]
alwaysApply: false
---
# TypeScript/JavaScript 安全

> 本文件以 TypeScript/JavaScript 特定内容扩展通用安全规则。

## 密钥管理

```typescript
// NEVER: Hardcoded secrets
const apiKey = "sk-proj-xxxxx"

// ALWAYS: Environment variables
const apiKey = process.env.OPENAI_API_KEY

if (!apiKey) {
  throw new Error('OPENAI_API_KEY not configured')
}
```

## 智能体支持

- 使用 **security-reviewer** 技能进行全面的安全审计
