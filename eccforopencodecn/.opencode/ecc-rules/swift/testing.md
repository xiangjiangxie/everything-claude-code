---
paths:
  - "**/*.swift"
  - "**/Package.swift"
---
# Swift 测试

> 本文件以 Swift 特定内容扩展了 [common/testing.md](../common/testing.md)。

## 框架

新测试使用 **Swift Testing**（`import Testing`）。使用 `@Test` 和 `#expect`：

```swift
@Test("User creation validates email")
func userCreationValidatesEmail() throws {
    #expect(throws: ValidationError.invalidEmail) {
        try User(email: "not-an-email")
    }
}
```

## 测试隔离

每个测试获得一个新实例 — 在 `init` 中设置，在 `deinit` 中清理。测试之间无共享可变状态。

## 参数化测试

```swift
@Test("Validates formats", arguments: ["json", "xml", "csv"])
func validatesFormat(format: String) throws {
    let parser = try Parser(format: format)
    #expect(parser.isValid)
}
```

## 覆盖率

```bash
swift test --enable-code-coverage
```

## 参考

参阅技能：`swift-protocol-di-testing` 了解基于 Protocol 的依赖注入和配合 Swift Testing 的 mock 模式。
