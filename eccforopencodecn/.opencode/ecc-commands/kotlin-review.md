---
description: 全面的 Kotlin 代码审查，涵盖惯用模式、空安全、协程安全和安全性。调用 kotlin-reviewer 代理。
---

# Kotlin 代码审查

此命令调用 **kotlin-reviewer** 代理进行全面的 Kotlin 专项代码审查。

## 此命令的功能

1. **识别 Kotlin 变更**：通过 `git diff` 查找修改的 `.kt` 和 `.kts` 文件
2. **运行构建和静态分析**：执行 `./gradlew build`、`detekt`、`ktlintCheck`
3. **安全扫描**：检查 SQL 注入、命令注入、硬编码密钥
4. **空安全审查**：分析 `!!` 的使用、平台类型处理、不安全的类型转换
5. **协程审查**：检查结构化并发、调度器使用、取消处理
6. **生成报告**：按严重程度分类问题

## 何时使用

在以下情况使用 `/kotlin-review`：
- 编写或修改 Kotlin 代码后
- 提交 Kotlin 变更前
- 审查包含 Kotlin 代码的 Pull Request
- 接手新的 Kotlin 代码库时
- 学习惯用 Kotlin 模式时

## 审查类别

### 严重（必须修复）
- SQL/命令注入漏洞
- 无正当理由的强制解包 `!!`
- 平台类型空安全违规
- 使用 GlobalScope（违反结构化并发）
- 硬编码凭证
- 不安全的反序列化

### 高（应该修复）
- 可用不可变状态时使用了可变状态
- 在协程上下文中进行阻塞调用
- 长循环中缺少取消检查
- 对密封类型的 `when` 未穷尽匹配
- 大型函数（>50 行）
- 深层嵌套（>4 层）

### 中（建议修复）
- 非惯用 Kotlin 代码（Java 风格模式）
- 缺少尾随逗号
- 作用域函数误用或嵌套
- 大型集合链缺少 sequence
- 冗余的显式类型

## 运行的自动检查

```bash
# 构建检查
./gradlew build

# 静态分析
./gradlew detekt

# 格式检查
./gradlew ktlintCheck

# 测试
./gradlew test
```

## 使用示例

````text
用户：/kotlin-review

代理：
# Kotlin 代码审查报告

## 审查的文件
- src/main/kotlin/com/example/service/UserService.kt（已修改）
- src/main/kotlin/com/example/routes/UserRoutes.kt（已修改）

## 静态分析结果
✓ 构建：成功
✓ detekt：无问题
⚠ ktlint：2 个格式警告

## 发现的问题

[严重] 强制解包空安全问题
文件：src/main/kotlin/com/example/service/UserService.kt:28
问题：对可空的仓库结果使用 !!
```kotlin
val user = repository.findById(id)!!  // NPE 风险
```
修复：使用安全调用和错误处理
```kotlin
val user = repository.findById(id)
    ?: throw UserNotFoundException("User $id not found")
```

[高] 使用 GlobalScope
文件：src/main/kotlin/com/example/routes/UserRoutes.kt:45
问题：使用 GlobalScope 破坏了结构化并发
```kotlin
GlobalScope.launch {
    notificationService.sendWelcome(user)
}
```
修复：使用调用的协程作用域
```kotlin
launch {
    notificationService.sendWelcome(user)
}
```

## 摘要
- 严重：1
- 高：1
- 中：0

建议：❌ 阻止合并，直到严重问题修复
````

## 审批标准

| 状态 | 条件 |
|------|------|
| ✅ 批准 | 无严重或高级问题 |
| ⚠️ 警告 | 仅有中级问题（谨慎合并） |
| ❌ 阻止 | 发现严重或高级问题 |

## 与其他命令的集成

- 先使用 `/kotlin-test` 确保测试通过
- 如果出现构建错误，使用 `/kotlin-build`
- 提交前使用 `/kotlin-review`
- 对于非 Kotlin 专项的问题，使用 `/code-review`

## 相关资源

- 代理：`agents/kotlin-reviewer.md`
- 技能：`skills/kotlin-patterns/`、`skills/kotlin-testing/`
