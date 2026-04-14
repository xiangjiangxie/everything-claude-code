---
description: 增量修复 Kotlin/Gradle 构建错误、编译器警告和依赖问题。调用 kotlin-build-resolver 智能体进行最小化精确修复。
---

# Kotlin 构建与修复

此命令调用 **kotlin-build-resolver** 智能体，以最小变更增量修复 Kotlin 构建错误。

## 此命令的功能

1. **运行诊断**：执行 `./gradlew build`、`detekt`、`ktlintCheck`
2. **解析错误**：按文件分组并按严重性排序
3. **增量修复**：每次修复一个错误
4. **验证每次修复**：每次变更后重新运行构建
5. **汇报摘要**：展示已修复和剩余的问题

## 使用场景

在以下情况使用 `/kotlin-build`：
- `./gradlew build` 失败报错
- Kotlin 编译器报告错误
- `./gradlew detekt` 报告违规
- Gradle 依赖解析失败
- 拉取变更后构建中断

## 运行的诊断命令

```bash
# 主要构建检查
./gradlew build 2>&1

# 静态分析
./gradlew detekt 2>&1 || echo "detekt not configured"
./gradlew ktlintCheck 2>&1 || echo "ktlint not configured"

# 依赖问题
./gradlew dependencies --configuration runtimeClasspath 2>&1 | head -100

# 缓存或依赖元数据可疑时的深度刷新（可选）
./gradlew build --refresh-dependencies
```

## 示例会话

````text
User: /kotlin-build

Agent:
# Kotlin 构建解决

## 初始诊断

```bash
$ ./gradlew build
e: src/main/kotlin/com/example/service/UserService.kt:25:15 Unresolved reference: UserRepository
e: src/main/kotlin/com/example/routes/UserRoutes.kt:42:9 Type mismatch: inferred type is String but Int was expected
e: src/main/kotlin/com/example/routes/UserRoutes.kt:58:5 'when' expression must be exhaustive
```

发现错误：3 个

## 修复 1：未解析的引用

文件：src/main/kotlin/com/example/service/UserService.kt:25
错误：Unresolved reference: UserRepository
原因：缺少导入

```kotlin
// Added import
import com.example.repository.UserRepository
```

```bash
$ ./gradlew build
# 剩余 2 个错误
```

## 修复 2：类型不匹配

文件：src/main/kotlin/com/example/routes/UserRoutes.kt:42
错误：Type mismatch: inferred type is String but Int was expected

```kotlin
// Changed
val count = call.parameters["count"]
// To
val count = call.parameters["count"]?.toIntOrNull()
    ?: return@get call.respond(HttpStatusCode.BadRequest, "Invalid count")
```

```bash
$ ./gradlew build
# 剩余 1 个错误
```

## 修复 3：when 非穷举

文件：src/main/kotlin/com/example/routes/UserRoutes.kt:58
错误：'when' expression must be exhaustive

```kotlin
// Added missing branch
when (user.role) {
    Role.ADMIN -> handleAdmin(user)
    Role.USER -> handleUser(user)
    Role.MODERATOR -> handleModerator(user) // Added
}
```

```bash
$ ./gradlew build
# 构建成功！
```

## 最终验证

```bash
$ ./gradlew detekt
# 无问题

$ ./gradlew test
# 所有测试通过
```

## 总结

| 指标 | 数量 |
|--------|-------|
| 修复的构建错误 | 3 |
| 修复的 Detekt 问题 | 0 |
| 修改的文件 | 2 |
| 剩余问题 | 0 |

构建状态：✅ 成功
````

## 常见错误修复

| 错误 | 典型修复 |
|-------|-------------|
| `Unresolved reference: X` | 添加导入或依赖 |
| `Type mismatch` | 修复类型转换或赋值 |
| `'when' must be exhaustive` | 添加缺失的密封类分支 |
| `Suspend function can only be called from coroutine` | 添加 `suspend` 修饰符 |
| `Smart cast impossible` | 使用局部 `val` 或 `let` |
| `None of the following candidates is applicable` | 修复参数类型 |
| `Could not resolve dependency` | 修复版本或添加仓库 |

## 修复策略

1. **先修复构建错误** - 代码必须能编译
2. **其次修复 Detekt 违规** - 修复代码质量问题
3. **再次修复 ktlint 警告** - 修复格式
4. **每次修复一个** - 验证每次变更
5. **最小变更** - 不重构，只修复

## 停止条件

智能体将在以下情况停止并报告：
- 3 次尝试后同一错误仍然存在
- 修复引入了更多错误
- 需要架构层面的变更
- 缺少外部依赖

## 相关命令

- `/kotlin-test` - 构建成功后运行测试
- `/kotlin-review` - 审查代码质量
- `/verify` - 完整验证循环

## 相关资源

- 智能体：`agents/kotlin-build-resolver.md`
- 技能：`skills/kotlin-patterns/`
