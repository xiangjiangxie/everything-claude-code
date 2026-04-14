---
paths:
  - "**/*.swift"
  - "**/Package.swift"
---
# Swift 编码风格

> 本文件以 Swift 特定内容扩展了 [common/coding-style.md](../common/coding-style.md)。

## 格式化

- **SwiftFormat** 用于自动格式化，**SwiftLint** 用于风格强制执行
- `swift-format` 在 Xcode 16+ 中作为替代方案内置

## 不可变性

- 优先使用 `let` 而非 `var` — 所有内容默认定义为 `let`，仅在编译器要求时才改为 `var`
- 默认使用 `struct` 及值语义；仅在需要标识或引用语义时使用 `class`

## 命名

遵循 [Apple API 设计指南](https://www.swift.org/documentation/api-design-guidelines/)：

- 在使用处追求清晰 — 省略不必要的词
- 根据角色而非类型命名方法和属性
- 使用 `static let` 而非全局常量

## 错误处理

使用类型化 throw（Swift 6+）和模式匹配：

```swift
func load(id: String) throws(LoadError) -> Item {
    guard let data = try? read(from: path) else {
        throw .fileNotFound(id)
    }
    return try decode(data)
}
```

## 并发

启用 Swift 6 严格并发检查。优先使用：

- `Sendable` 值类型用于跨隔离边界的数据
- Actor 用于共享可变状态
- 结构化并发（`async let`、`TaskGroup`）优先于非结构化的 `Task {}`
