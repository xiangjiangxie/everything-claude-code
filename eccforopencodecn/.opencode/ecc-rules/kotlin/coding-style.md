---
paths:
  - "**/*.kt"
  - "**/*.kts"
---
# Kotlin 编码风格

> 本文件以 Kotlin 特定内容扩展了 [common/coding-style.md](../common/coding-style.md)。

## 格式化

- 使用 **ktlint** 或 **Detekt** 强制执行风格
- 官方 Kotlin 代码风格（在 `gradle.properties` 中设置 `kotlin.code.style=official`）

## 不可变性

- 优先使用 `val` 而非 `var` — 默认使用 `val`，仅在需要变更时使用 `var`
- 值类型使用 `data class`；公共 API 中使用不可变集合（`List`、`Map`、`Set`）
- 状态更新使用写时复制：`state.copy(field = newValue)`

## 命名

遵循 Kotlin 约定：
- `camelCase` 用于函数和属性
- `PascalCase` 用于类、接口、对象和类型别名
- `SCREAMING_SNAKE_CASE` 用于常量（`const val` 或 `@JvmStatic`）
- 接口前缀使用行为而非 `I`：`Clickable` 而不是 `IClickable`

## 空安全

- 永远不要使用 `!!` — 优先使用 `?.`、`?:`、`requireNotNull()` 或 `checkNotNull()`
- 使用 `?.let {}` 进行作用域内的空安全操作
- 从确实可能无结果的函数返回可空类型

```kotlin
// 坏
val name = user!!.name

// 好
val name = user?.name ?: "Unknown"
val name = requireNotNull(user) { "User must be set before accessing name" }.name
```

## 密封类型

使用密封类/接口来建模封闭的状态层次结构：

```kotlin
sealed interface UiState<out T> {
    data object Loading : UiState<Nothing>
    data class Success<T>(val data: T) : UiState<T>
    data class Error(val message: String) : UiState<Nothing>
}
```

对密封类型始终使用穷举的 `when` — 不要使用 `else` 分支。

## 扩展函数

使用扩展函数进行工具操作，但保持可发现性：
- 放在以接收者类型命名的文件中（`StringExt.kt`、`FlowExt.kt`）
- 保持作用域有限 — 不要为 `Any` 或过于泛化的类型添加扩展

## 作用域函数

使用正确的作用域函数：
- `let` — 空检查 + 转换：`user?.let { greet(it) }`
- `run` — 使用接收者计算结果：`service.run { fetch(config) }`
- `apply` — 配置对象：`builder.apply { timeout = 30 }`
- `also` — 副作用：`result.also { log(it) }`
- 避免深层嵌套作用域函数（最多 2 层）

## 错误处理

- 使用 `Result<T>` 或自定义密封类型
- 使用 `runCatching {}` 包装可能抛出异常的代码
- 永远不要捕获 `CancellationException` — 始终重新抛出
- 避免将 `try-catch` 用于控制流

```kotlin
// 坏 — 使用异常进行控制流
val user = try { repository.getUser(id) } catch (e: NotFoundException) { null }

// 好 — 可空返回
val user: User? = repository.findUser(id)
```
