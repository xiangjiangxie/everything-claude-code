---
description: "Kotlin 模式，扩展通用规则"
globs: ["**/*.kt", "**/*.kts", "**/build.gradle.kts"]
alwaysApply: false
---
# Kotlin 模式

> 本文件以 Kotlin 特定内容扩展通用模式规则。

## 密封类

使用密封类/接口实现穷尽式类型层级：

```kotlin
sealed class Result<out T> {
    data class Success<T>(val data: T) : Result<T>()
    data class Failure(val error: AppError) : Result<Nothing>()
}
```

## 扩展函数

在不使用继承的情况下添加行为，限定在使用处的作用域内：

```kotlin
fun String.toSlug(): String =
    lowercase().replace(Regex("[^a-z0-9\\s-]"), "").replace(Regex("\\s+"), "-")
```

## 作用域函数

- `let`：转换可空值或限定作用域的结果
- `apply`：配置对象
- `also`：执行副作用
- 避免嵌套作用域函数

## 依赖注入

在 Ktor 项目中使用 Koin 进行依赖注入：

```kotlin
val appModule = module {
    single<UserRepository> { ExposedUserRepository(get()) }
    single { UserService(get()) }
}
```

## 参考

参见技能：`kotlin-patterns` 获取完整的 Kotlin 模式，包括协程、DSL 构建器和委托。
