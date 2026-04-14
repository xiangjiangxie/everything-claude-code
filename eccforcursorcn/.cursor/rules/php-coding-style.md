---
description: "PHP 编码风格，扩展通用规则"
globs: ["**/*.php", "**/composer.json"]
alwaysApply: false
---
# PHP 编码风格

> 本文件以 PHP 特定内容扩展通用编码风格规则。

## 标准

- 遵循 **PSR-12** 格式化和命名约定。
- 在应用代码中优先使用 `declare(strict_types=1);`。
- 在新代码允许的范围内，全面使用标量类型提示、返回类型和类型化属性。

## 不可变性

- 对跨越服务边界的数据优先使用不可变 DTO 和值对象。
- 尽可能为请求/响应载荷使用 `readonly` 属性或不可变构造函数。
- 简单映射使用数组；对业务关键结构提升为显式类。

## 格式化

- 使用 **PHP-CS-Fixer** 或 **Laravel Pint** 进行格式化。
- 使用 **PHPStan** 或 **Psalm** 进行静态分析。
