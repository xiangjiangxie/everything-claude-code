---
description: "Kotlin 测试，扩展通用规则"
globs: ["**/*.kt", "**/*.kts", "**/build.gradle.kts"]
alwaysApply: false
---
# Kotlin 测试

> 本文件以 Kotlin 特定内容扩展通用测试规则。

## 框架

使用 **Kotest** 配合规范风格（StringSpec、FunSpec、BehaviorSpec）和 **MockK** 进行模拟。

## 协程测试

使用 `kotlinx-coroutines-test` 中的 `runTest`：

```kotlin
test("async operation completes") {
    runTest {
        val result = service.fetchData()
        result.shouldNotBeEmpty()
    }
}
```

## 覆盖率

使用 **Kover** 生成覆盖率报告：

```bash
./gradlew koverHtmlReport
./gradlew koverVerify
```

## 参考

参见技能：`kotlin-testing` 获取详细的 Kotest 模式、MockK 用法和基于属性的测试。
