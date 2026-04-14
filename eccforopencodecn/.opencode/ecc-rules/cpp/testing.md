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
# C++ 测试

> 本文件以 C++ 特定内容扩展了 [common/testing.md](../common/testing.md)。

## 框架

使用 **GoogleTest**（gtest/gmock）配合 **CMake/CTest**。

## 运行测试

```bash
cmake --build build && ctest --test-dir build --output-on-failure
```

## 覆盖率

```bash
cmake -DCMAKE_CXX_FLAGS="--coverage" -DCMAKE_EXE_LINKER_FLAGS="--coverage" ..
cmake --build .
ctest --output-on-failure
lcov --capture --directory . --output-file coverage.info
```

## 消毒器

在 CI 中始终使用消毒器运行测试：

```bash
cmake -DCMAKE_CXX_FLAGS="-fsanitize=address,undefined" ..
```

## 参考

参阅技能：`cpp-testing` 了解详细的 C++ 测试模式、TDD 工作流和 GoogleTest/GMock 用法。
