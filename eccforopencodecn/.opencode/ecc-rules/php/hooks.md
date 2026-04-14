---
paths:
  - "**/*.php"
  - "**/composer.json"
  - "**/phpstan.neon"
  - "**/phpstan.neon.dist"
  - "**/psalm.xml"
---
# PHP 钩子

> 本文件以 PHP 特定内容扩展了 [common/hooks.md](../common/hooks.md)。

## PostToolUse 钩子

在 `~/.claude/settings.json` 中配置：

- **Pint / PHP-CS-Fixer**：自动格式化编辑过的 `.php` 文件。
- **PHPStan / Psalm**：在有类型的代码库中，PHP 编辑后运行静态分析。
- **PHPUnit / Pest**：当编辑影响行为时，对涉及的文件或模块运行目标测试。

## 警告

- 对编辑文件中残留的 `var_dump`、`dd`、`dump` 或 `die()` 发出警告。
- 当编辑的 PHP 文件添加原始 SQL 或禁用 CSRF/会话保护时发出警告。
