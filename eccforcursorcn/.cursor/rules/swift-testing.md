---
description: "Swift 测试，扩展通用规则"
globs: ["**/*.swift", "**/Package.swift"]
alwaysApply: false
---
# Swift 测试

> 本文件以 Swift 特定内容扩展通用测试规则。

## 框架

使用 **Swift Testing**（`import Testing`）编写新测试。使用 `@Test` 和 `#expect`：

```swift
@Test("User creation validates email")
func userCreationValidatesEmail() throws {
    #expect(throws: ValidationError.invalidEmail) {
        try User(email: "not-an-email")
    }
}
```

## 测试隔离

每个测试获得独立实例——在 `init` 中设置，在 `deinit` 中清理。测试之间不共享可变状态。

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

参见技能：`swift-protocol-di-testing` 获取基于协议的依赖注入和使用 Swift Testing 的模拟模式。
