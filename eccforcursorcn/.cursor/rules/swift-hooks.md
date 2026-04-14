---
description: "Swift 钩子，扩展通用规则"
globs: ["**/*.swift", "**/Package.swift"]
alwaysApply: false
---
# Swift 钩子

> 本文件以 Swift 特定内容扩展通用钩子规则。

## PostToolUse 钩子

在 `~/.claude/settings.json` 中配置：

- **SwiftFormat**：编辑后自动格式化 `.swift` 文件
- **SwiftLint**：编辑 `.swift` 文件后运行代码检查
- **swift build**：编辑后对修改的包进行类型检查

## 警告

标记 `print()` 语句——在生产代码中应使用 `os.Logger` 或结构化日志替代。
