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
# C++ 钩子

> 本文件以 C++ 特定内容扩展了 [common/hooks.md](../common/hooks.md)。

## 构建钩子

提交 C++ 变更前运行以下检查：

```bash
# 格式检查
clang-format --dry-run --Werror src/*.cpp src/*.hpp

# 静态分析
clang-tidy src/*.cpp -- -std=c++17

# 构建
cmake --build build

# 测试
ctest --test-dir build --output-on-failure
```

## 推荐的 CI 流水线

1. **clang-format** — 格式检查
2. **clang-tidy** — 静态分析
3. **cppcheck** — 附加分析
4. **cmake build** — 编译
5. **ctest** — 使用消毒器运行测试
