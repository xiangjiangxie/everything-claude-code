---
paths:
  - "**/*.pl"
  - "**/*.pm"
  - "**/*.t"
  - "**/*.psgi"
  - "**/*.cgi"
---
# Perl 钩子

> 本文件以 Perl 特定内容扩展了 [common/hooks.md](../common/hooks.md)。

## PostToolUse 钩子

在 `~/.claude/settings.json` 中配置：

- **perltidy**：编辑后自动格式化 `.pl` 和 `.pm` 文件
- **perlcritic**：编辑 `.pm` 文件后运行 lint 检查

## 警告

- 对非脚本 `.pm` 文件中的 `print` 发出警告 — 改用 `say` 或日志模块（如 `Log::Any`）
