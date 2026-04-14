---
description: "Kotlin 钩子，扩展通用规则"
globs: ["**/*.kt", "**/*.kts", "**/build.gradle.kts"]
alwaysApply: false
---
# Kotlin 钩子

> 本文件以 Kotlin 特定内容扩展通用钩子规则。

## PostToolUse 钩子

在 `~/.claude/settings.json` 中配置：

- **ktfmt/ktlint**：编辑后自动格式化 `.kt` 和 `.kts` 文件
- **detekt**：编辑 Kotlin 文件后运行静态分析
- **./gradlew build**：修改后验证编译是否通过
