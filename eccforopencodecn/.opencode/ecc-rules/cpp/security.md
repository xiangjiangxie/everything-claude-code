---
paths:
  - "**/*.cpp"
  - "**/*.hpp"
  - "**/*.cc"
  - "**/*.hh"
  - "**/*.cxx"
  - "**/*.h"
  - "**/CMakeLists.txt"
---
# C++ 安全

> 本文件以 C++ 特定内容扩展了 [common/security.md](../common/security.md)。

## 内存安全

- 永远不要使用裸的 `new`/`delete` — 使用智能指针
- 永远不要使用 C 风格数组 — 使用 `std::array` 或 `std::vector`
- 永远不要使用 `malloc`/`free` — 使用 C++ 分配
- 除非绝对必要，避免 `reinterpret_cast`

## 缓冲区溢出

- 使用 `std::string` 替代 `char*`
- 安全要求时使用 `.at()` 进行边界检查访问
- 永远不要使用 `strcpy`、`strcat`、`sprintf` — 使用 `std::string` 或 `fmt::format`

## 未定义行为

- 始终初始化变量
- 避免有符号整数溢出
- 永远不要解引用空指针或悬空指针
- 在 CI 中使用消毒器：
  ```bash
  cmake -DCMAKE_CXX_FLAGS="-fsanitize=address,undefined" ..
  ```

## 静态分析

- 使用 **clang-tidy** 进行自动化检查：
  ```bash
  clang-tidy --checks='*' src/*.cpp
  ```
- 使用 **cppcheck** 进行附加分析：
  ```bash
  cppcheck --enable=all src/
  ```

## 参考

参阅技能：`cpp-coding-standards` 了解详细的安全指南。
