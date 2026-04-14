---
description: "Swift 模式，扩展通用规则"
globs: ["**/*.swift", "**/Package.swift"]
alwaysApply: false
---
# Swift 模式

> 本文件以 Swift 特定内容扩展通用模式规则。

## 面向协议设计

定义小而聚焦的协议。使用协议扩展提供共享默认实现：

```swift
protocol Repository: Sendable {
    associatedtype Item: Identifiable & Sendable
    func find(by id: Item.ID) async throws -> Item?
    func save(_ item: Item) async throws
}
```

## 值类型

- 使用结构体作为数据传输对象和模型
- 使用带关联值的枚举建模不同状态：

```swift
enum LoadState<T: Sendable>: Sendable {
    case idle
    case loading
    case loaded(T)
    case failed(Error)
}
```

## Actor 模式

使用 Actor 管理共享可变状态，替代锁或调度队列：

```swift
actor Cache<Key: Hashable & Sendable, Value: Sendable> {
    private var storage: [Key: Value] = [:]

    func get(_ key: Key) -> Value? { storage[key] }
    func set(_ key: Key, value: Value) { storage[key] = value }
}
```

## 依赖注入

通过协议注入并使用默认参数——生产环境使用默认值，测试注入模拟对象：

```swift
struct UserService {
    private let repository: any UserRepository

    init(repository: any UserRepository = DefaultUserRepository()) {
        self.repository = repository
    }
}
```

## 参考

参见技能：`swift-actor-persistence` 获取基于 Actor 的持久化模式。
参见技能：`swift-protocol-di-testing` 获取基于协议的依赖注入和测试模式。
