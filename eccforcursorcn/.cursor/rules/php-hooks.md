---
description: "PHP 钩子，扩展通用规则"
globs: ["**/*.php", "**/composer.json", "**/phpstan.neon", "**/phpstan.neon.dist", "**/psalm.xml"]
alwaysApply: false
---
# PHP 钩子

> 本文件以 PHP 特定内容扩展通用钩子规则。

## PostToolUse 钩子

在 `~/.claude/settings.json` 中配置：

- **Pint / PHP-CS-Fixer**：编辑后自动格式化 `.php` 文件。
- **PHPStan / Psalm**：在类型化代码库中编辑 PHP 后运行静态分析。
- **PHPUnit / Pest**：当编辑影响行为时，对涉及的文件或模块运行针对性测试。

## 警告

- 对编辑文件中遗留的 `var_dump`、`dd`、`dump` 或 `die()` 发出警告。
- 当编辑的 PHP 文件中添加了原始 SQL 或禁用了 CSRF/会话保护时发出警告。
