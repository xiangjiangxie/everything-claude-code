---
description: 全面的 C++ 代码审查，涵盖内存安全、现代 C++ 惯用法、并发和安全性。调用 cpp-reviewer 智能体。
---

# C++ 代码审查

此命令调用 **cpp-reviewer** 智能体进行全面的 C++ 专项代码审查。

## 此命令的功能

1. **识别 C++ 变更**：通过 `git diff` 查找修改的 `.cpp`、`.hpp`、`.cc`、`.h` 文件
2. **运行静态分析**：执行 `clang-tidy` 和 `cppcheck`
3. **内存安全扫描**：检查裸 new/delete、缓冲区溢出、use-after-free
4. **并发审查**：分析线程安全、mutex 使用、数据竞争
5. **现代 C++ 检查**：验证代码是否遵循 C++17/20 规范和最佳实践
6. **生成报告**：按严重级别分类问题

## 使用场景

在以下情况使用 `/cpp-review`：
- 编写或修改 C++ 代码之后
- 提交 C++ 变更之前
- 审查包含 C++ 代码的 Pull Request
- 接手新的 C++ 代码库
- 检查内存安全问题

## 审查类别

### 严重（必须修复）
- 无 RAII 的裸 `new`/`delete`
- 缓冲区溢出和 use-after-free
- 无同步的数据竞争
- 通过 `system()` 的命令注入
- 未初始化变量的读取
- 空指针解引用

### 高（应当修复）
- 违反五法则
- 缺少 `std::lock_guard` / `std::scoped_lock`
- 无适当生命周期管理的分离线程
- 使用 C 风格转换而非 `static_cast`/`dynamic_cast`
- 缺少 `const` 正确性

### 中（建议改进）
- 不必要的复制（按值传递而非 `const&`）
- 已知大小的容器缺少 `reserve()`
- 头文件中的 `using namespace std;`
- 重要返回值缺少 `[[nodiscard]]`
- 过于复杂的模板元编程

## 自动运行的检查

```bash
# 静态分析
clang-tidy --checks='*,-llvmlibc-*' src/*.cpp -- -std=c++17

# 额外分析
cppcheck --enable=all --suppress=missingIncludeSystem src/

# 带警告构建
cmake --build build -- -Wall -Wextra -Wpedantic
```

## 使用示例

```text
User: /cpp-review

Agent:
# C++ 代码审查报告

## 审查的文件
- src/handler/user.cpp（已修改）
- src/service/auth.cpp（已修改）

## 静态分析结果
✓ clang-tidy：2 个警告
✓ cppcheck：无问题

## 发现的问题

[严重] 内存泄漏
文件：src/service/auth.cpp:45
问题：裸 `new` 无对应 `delete`
```cpp
auto* session = new Session(userId);  // Memory leak!
cache[userId] = session;
```
修复：使用 `std::unique_ptr`
```cpp
auto session = std::make_unique<Session>(userId);
cache[userId] = std::move(session);
```

[高] 缺少 const 引用
文件：src/handler/user.cpp:28
问题：大对象按值传递
```cpp
void processUser(User user) {  // Unnecessary copy
```
修复：按 const 引用传递
```cpp
void processUser(const User& user) {
```

## 总结
- 严重：1
- 高：1
- 中：0

建议：❌ 在严重问题修复前阻止合并
```

## 审批标准

| 状态 | 条件 |
|--------|-----------|
| ✅ 批准 | 无严重或高级问题 |
| ⚠️ 警告 | 仅有中级问题（谨慎合并） |
| ❌ 阻止 | 发现严重或高级问题 |

## 与其他命令的集成

- 先使用 `/cpp-test` 确保测试通过
- 如有构建错误使用 `/cpp-build`
- 提交前使用 `/cpp-review`
- 对非 C++ 特定问题使用 `/code-review`

## 相关资源

- 智能体：`agents/cpp-reviewer.md`
- 技能：`skills/cpp-coding-standards/`、`skills/cpp-testing/`
