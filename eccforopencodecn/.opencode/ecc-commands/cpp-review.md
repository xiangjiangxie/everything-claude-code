---
description: 全面的 C++ 代码审查，涵盖内存安全、现代 C++ 惯用法、并发和安全性。调用 cpp-reviewer 代理。
---

# C++ 代码审查

此命令调用 **cpp-reviewer** 代理进行全面的 C++ 专项代码审查。

## 此命令的功能

1. **识别 C++ 变更**：通过 `git diff` 查找修改的 `.cpp`、`.hpp`、`.cc`、`.h` 文件
2. **运行静态分析**：执行 `clang-tidy` 和 `cppcheck`
3. **内存安全扫描**：检查裸 new/delete、缓冲区溢出、释放后使用
4. **并发审查**：分析线程安全、mutex 使用、数据竞争
5. **现代 C++ 检查**：验证代码是否遵循 C++17/20 约定和最佳实践
6. **生成报告**：按严重程度分类问题

## 何时使用

在以下情况使用 `/cpp-review`：
- 编写或修改 C++ 代码后
- 提交 C++ 变更前
- 审查包含 C++ 代码的 Pull Request
- 接手新的 C++ 代码库时
- 检查内存安全问题时

## 审查类别

### 严重（必须修复）
- 没有 RAII 的裸 `new`/`delete`
- 缓冲区溢出和释放后使用
- 无同步的数据竞争
- 通过 `system()` 的命令注入
- 读取未初始化的变量
- 空指针解引用

### 高（应该修复）
- 违反五法则
- 缺少 `std::lock_guard` / `std::scoped_lock`
- 分离的线程缺少适当的生命周期管理
- 使用 C 风格转换而非 `static_cast`/`dynamic_cast`
- 缺少 `const` 正确性

### 中（建议修复）
- 不必要的拷贝（按值传递而非 `const&`）
- 已知大小的容器缺少 `reserve()`
- 头文件中使用 `using namespace std;`
- 重要返回值缺少 `[[nodiscard]]`
- 过度复杂的模板元编程

## 运行的自动检查

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
用户：/cpp-review

代理：
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
问题：裸 `new` 没有对应的 `delete`
```cpp
auto* session = new Session(userId);  // 内存泄漏！
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
void processUser(User user) {  // 不必要的拷贝
```
修复：按 const 引用传递
```cpp
void processUser(const User& user) {
```

## 摘要
- 严重：1
- 高：1
- 中：0

建议：❌ 阻止合并，直到严重问题修复
```

## 审批标准

| 状态 | 条件 |
|------|------|
| ✅ 批准 | 无严重或高级问题 |
| ⚠️ 警告 | 仅有中级问题（谨慎合并） |
| ❌ 阻止 | 发现严重或高级问题 |

## 与其他命令的集成

- 先使用 `/cpp-test` 确保测试通过
- 如果出现构建错误，使用 `/cpp-build`
- 提交前使用 `/cpp-review`
- 对于非 C++ 专项的问题，使用 `/code-review`

## 相关资源

- 代理：`agents/cpp-reviewer.md`
- 技能：`skills/cpp-coding-standards/`、`skills/cpp-testing/`
