---
description: "PHP 测试，扩展通用规则"
globs: ["**/*.php", "**/phpunit.xml", "**/phpunit.xml.dist", "**/composer.json"]
alwaysApply: false
---
# PHP 测试

> 本文件以 PHP 特定内容扩展通用测试规则。

## 框架

默认使用 **PHPUnit** 作为测试框架。项目已在使用 **Pest** 的情况下亦可接受。

## 覆盖率

```bash
vendor/bin/phpunit --coverage-text
# or
vendor/bin/pest --coverage
```

## 测试组织

- 将快速单元测试与框架/数据库集成测试分离。
- 使用工厂/构建器生成测试数据，而非大量手写数组。
- HTTP/控制器测试聚焦于传输和验证；将业务规则移入服务级测试。
