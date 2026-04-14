---
description: "Kotlin 编码风格，扩展通用规则"
globs: ["**/*.kt", "**/*.kts", "**/build.gradle.kts"]
alwaysApply: false
---
# Kotlin 编码风格

> 本文件以 Kotlin 特定内容扩展通用编码风格规则。

## 格式化

- 通过 **ktfmt** 或 **ktlint** 自动格式化（在 `kotlin-hooks.md` 中配置）
- 在多行声明中使用尾随逗号

## 不可变性

全局不可变性要求在通用编码风格规则中已做强制规定。
针对 Kotlin 具体而言：

- 优先使用 `val` 而非 `var`
- 使用不可变集合类型（`List`、`Map`、`Set`）
- 使用 `data class` 配合 `copy()` 进行不可变更新

## 空安全

- 避免使用 `!!`——使用 `?.`、`?:`、`require` 或 `checkNotNull`
- 在 Java 互操作边界处显式处理平台类型

## 表达式函数体

对单表达式函数优先使用表达式函数体：

```kotlin
fun isAdult(age: Int): Boolean = age >= 18
```

## 参考

参见技能：`kotlin-patterns` 获取完整的 Kotlin 惯用法和模式。
