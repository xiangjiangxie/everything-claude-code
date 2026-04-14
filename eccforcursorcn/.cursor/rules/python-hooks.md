---
description: "Python 钩子，扩展通用规则"
globs: ["**/*.py", "**/*.pyi"]
alwaysApply: false
---
# Python 钩子

> 本文件以 Python 特定内容扩展通用钩子规则。

## PostToolUse 钩子

在 `~/.claude/settings.json` 中配置：

- **black/ruff**：编辑后自动格式化 `.py` 文件
- **mypy/pyright**：编辑 `.py` 文件后运行类型检查

## 警告

- 对编辑文件中的 `print()` 语句发出警告（应使用 `logging` 模块替代）
