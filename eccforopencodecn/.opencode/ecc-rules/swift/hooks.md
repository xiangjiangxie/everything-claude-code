---
paths:
  - "**/*.swift"
  - "**/Package.swift"
---
# Swift 钩子

> 本文件以 Swift 特定内容扩展了 [common/hooks.md](../common/hooks.md)。

## PostToolUse 钩子

在 `~/.claude/settings.json` 中配置：

- **SwiftFormat**：编辑后自动格式化 `.swift` 文件
- **SwiftLint**：编辑 `.swift` 文件后运行 lint 检查
- **swift build**：编辑后对修改的包进行类型检查

## 警告

标记 `print()` 语句 — 生产代码应使用 `os.Logger` 或结构化日志替代。
