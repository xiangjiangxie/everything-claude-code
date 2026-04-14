---
description: 修复 C++ 构建错误、CMake 问题和链接器问题，采用增量方式。调用 cpp-build-resolver 代理进行最小化、精确的修复。
---

# C++ 构建与修复

此命令调用 **cpp-build-resolver** 代理，以最小的更改增量修复 C++ 构建错误。

## 此命令的功能

1. **运行诊断**：执行 `cmake --build`、`clang-tidy`、`cppcheck`
2. **解析错误**：按文件分组并按严重程度排序
3. **增量修复**：每次修复一个错误
4. **验证每个修复**：每次更改后重新运行构建
5. **报告摘要**：展示已修复的和剩余的问题

## 何时使用

在以下情况使用 `/cpp-build`：
- `cmake --build build` 出错失败
- 链接器错误（未定义引用、多重定义）
- 模板实例化失败
- 头文件包含/依赖问题
- 拉取更改后构建中断

## 运行的诊断命令

```bash
# CMake 配置
cmake -B build -S .

# 构建
cmake --build build 2>&1 | head -100

# 静态分析（如可用）
clang-tidy src/*.cpp -- -std=c++17
cppcheck --enable=all src/
```

## 示例会话

```text
用户：/cpp-build

代理：
# C++ 构建问题解决

## 初始诊断

```bash
$ cmake --build build
src/service/user.cpp:25:15: error: use of undeclared identifier 'UserRepository'
src/handler/api.cpp:42:9: error: no matching function for call to 'process'
src/handler/api.cpp:58:1: error: non-void function does not return a value
```

发现错误：3 个

## 修复 1：未声明的标识符

文件：src/service/user.cpp:25
错误：use of undeclared identifier 'UserRepository'
原因：缺少头文件包含

```cpp
// 添加 include
#include "repository/user_repository.hpp"
```

```bash
$ cmake --build build
# 剩余 2 个错误
```

## 修复 2：无匹配函数

文件：src/handler/api.cpp:42
错误：no matching function for call to 'process'

```cpp
// 更改前
process(params.get("count"));
// 更改后
process(std::stoi(params.get("count")));
```

```bash
$ cmake --build build
# 剩余 1 个错误
```

## 修复 3：缺少返回值

文件：src/handler/api.cpp:58
错误：non-void function does not return a value

```cpp
std::optional<User> getUser(const std::string& id) {
    if (id.empty()) {
        return std::nullopt;
    }
    auto user = findUser(id);
    // 添加缺失的返回语句
    return user;
}
```

```bash
$ cmake --build build
# 构建成功！
```

## 最终验证

```bash
$ ctest --test-dir build --output-on-failure
Test project build
    1/5 Test #1: unit_tests ........   Passed    0.02 sec
    2/5 Test #2: integration_tests    Passed    0.15 sec
所有测试通过。
```

## 摘要

| 指标 | 数量 |
|------|------|
| 修复的构建错误 | 3 |
| 修复的链接器错误 | 0 |
| 修改的文件 | 2 |
| 剩余问题 | 0 |

构建状态：✅ 成功
```

## 常见修复的错误

| 错误 | 典型修复 |
|------|---------|
| `undeclared identifier` | 添加 `#include` 或修正拼写 |
| `no matching function` | 修正参数类型或添加重载 |
| `undefined reference` | 链接库或添加实现 |
| `multiple definition` | 使用 `inline` 或移到 .cpp |
| `incomplete type` | 将前向声明替换为 `#include` |
| `no member named X` | 修正成员名称或包含头文件 |
| `cannot convert X to Y` | 添加适当的类型转换 |
| `CMake Error` | 修复 CMakeLists.txt 配置 |

## 修复策略

1. **先修复编译错误** - 代码必须能编译
2. **其次修复链接器错误** - 解决未定义引用
3. **第三修复警告** - 使用 `-Wall -Wextra` 修复
4. **每次一个修复** - 验证每个更改
5. **最小化更改** - 不要重构，只做修复

## 停止条件

代理将在以下情况下停止并报告：
- 同一错误在 3 次尝试后仍然存在
- 修复引入了更多错误
- 需要架构级别的更改
- 缺少外部依赖

## 相关命令

- `/cpp-test` - 构建成功后运行测试
- `/cpp-review` - 审查代码质量
- `/verify` - 完整验证循环

## 相关资源

- 代理：`agents/cpp-build-resolver.md`
- 技能：`skills/cpp-coding-standards/`
