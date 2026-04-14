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
# C++ 模式

> 本文件以 C++ 特定内容扩展了 [common/patterns.md](../common/patterns.md)。

## RAII（资源获取即初始化）

将资源生命周期绑定到对象生命周期：

```cpp
class FileHandle {
public:
    explicit FileHandle(const std::string& path) : file_(std::fopen(path.c_str(), "r")) {}
    ~FileHandle() { if (file_) std::fclose(file_); }
    FileHandle(const FileHandle&) = delete;
    FileHandle& operator=(const FileHandle&) = delete;
private:
    std::FILE* file_;
};
```

## 五法则/零法则

- **零法则**：优先使用不需要自定义析构函数、拷贝/移动构造函数或赋值的类
- **五法则**：如果定义了析构函数/拷贝构造/拷贝赋值/移动构造/移动赋值中的任何一个，就定义全部五个

## 值语义

- 小型/简单类型按值传递
- 大型类型按 `const&` 传递
- 按值返回（依赖 RVO/NRVO）
- 对 sink 参数使用移动语义

## 错误处理

- 对异常条件使用异常
- 对可能不存在的值使用 `std::optional`
- 对预期的失败使用 `std::expected`（C++23）或 result 类型

## 参考

参阅技能：`cpp-coding-standards` 了解全面的 C++ 模式和反模式。
