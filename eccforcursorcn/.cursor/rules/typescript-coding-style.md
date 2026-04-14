---
description: "TypeScript 编码风格，扩展通用规则"
globs: ["**/*.ts", "**/*.tsx", "**/*.js", "**/*.jsx"]
alwaysApply: false
---
# TypeScript/JavaScript 编码风格

> 本文件以 TypeScript/JavaScript 特定内容扩展通用编码风格规则。

## 不可变性

使用展开运算符进行不可变更新：

```typescript
// WRONG: Mutation
function updateUser(user, name) {
  user.name = name  // MUTATION!
  return user
}

// CORRECT: Immutability
function updateUser(user, name) {
  return {
    ...user,
    name
  }
}
```

## 错误处理

使用 async/await 配合 try-catch：

```typescript
try {
  const result = await riskyOperation()
  return result
} catch (error) {
  console.error('Operation failed:', error)
  throw new Error('Detailed user-friendly message')
}
```

## 输入验证

使用 Zod 进行基于模式的验证：

```typescript
import { z } from 'zod'

const schema = z.object({
  email: z.string().email(),
  age: z.number().int().min(0).max(150)
})

const validated = schema.parse(input)
```

## Console.log

- 生产代码中禁止 `console.log` 语句
- 应使用专业的日志库替代
- 参见钩子了解自动检测机制
