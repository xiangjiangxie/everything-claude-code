---
paths:
  - "**/*.ts"
  - "**/*.tsx"
  - "**/*.js"
  - "**/*.jsx"
---
# TypeScript/JavaScript 安全

> 本文件以 TypeScript/JavaScript 特定内容扩展了 [common/security.md](../common/security.md)。

## 密钥管理

```typescript
// 永远不要：硬编码密钥
const apiKey = "sk-proj-xxxxx"

// 始终：使用环境变量
const apiKey = process.env.OPENAI_API_KEY

if (!apiKey) {
  throw new Error('OPENAI_API_KEY not configured')
}
```

## 代理支持

- 使用 **security-reviewer** 技能进行全面的安全审计
