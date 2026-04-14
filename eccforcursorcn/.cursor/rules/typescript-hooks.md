---
description: "TypeScript 钩子，扩展通用规则"
globs: ["**/*.ts", "**/*.tsx", "**/*.js", "**/*.jsx"]
alwaysApply: false
---
# TypeScript/JavaScript 钩子

> 本文件以 TypeScript/JavaScript 特定内容扩展通用钩子规则。

## PostToolUse 钩子

在 `~/.claude/settings.json` 中配置：

- **Prettier**：编辑后自动格式化 JS/TS 文件
- **TypeScript 检查**：编辑 `.ts`/`.tsx` 文件后运行 `tsc`
- **console.log 警告**：对编辑文件中的 `console.log` 发出警告

## Stop 钩子

- **console.log 审计**：会话结束前检查所有修改文件中的 `console.log`
