---
paths:
  - "**/*.php"
  - "**/phpunit.xml"
  - "**/phpunit.xml.dist"
  - "**/composer.json"
---
# PHP 测试

> 本文件以 PHP 特定内容扩展了 [common/testing.md](../common/testing.md)。

## 框架

使用 **PHPUnit** 作为默认测试框架。如果项目中已配置 **Pest**，新测试优先使用 Pest，避免混用框架。

## 覆盖率

```bash
vendor/bin/phpunit --coverage-text
# 或
vendor/bin/pest --coverage
```

在 CI 中优先使用 **pcov** 或 **Xdebug**，将覆盖率阈值保持在 CI 中而非口头约定。

## 测试组织

- 将快速单元测试与框架/数据库集成测试分开。
- 使用工厂/构建器创建 fixtures，而非大量手写数组。
- HTTP/控制器测试聚焦于传输和验证；将业务规则移到服务层测试中。

## Inertia

如果项目使用 Inertia.js，优先使用 `assertInertia` 配合 `AssertableInertia` 来验证组件名称和 props，而非原始 JSON 断言。

## 参考

参阅技能：`tdd-workflow` 了解全仓库的 RED -> GREEN -> REFACTOR 循环。
参阅技能：`laravel-tdd` 了解 Laravel 特定的测试模式（PHPUnit 和 Pest）。
