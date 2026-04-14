---
paths:
  - "**/*.swift"
  - "**/Package.swift"
---
# Swift 模式

> 本文件以 Swift 特定内容扩展了 [common/patterns.md](../common/patterns.md)。

## 面向协议设计

定义小巧、专注的协议。使用协议扩展提供共享默认实现：

```swift
protocol Repository: Sendable {
    associatedtype Item: Identifiable & Sendable
    func find(by id: Item.ID) async throws -> Item?
    func save(_ item: Item) async throws
}
```

## 值类型

- 对数据传输对象和模型使用结构体
- 使用带关联值的枚举来建模不同状态：

```swift
enum LoadState<T: Sendable>: Sendable {
    case idle
    case loading
    case loaded(T)
    case failed(Error)
}
```

## Actor 模式

使用 Actor 代替锁或派发队列来管理共享可变状态：

```swift
actor Cache<Key: Hashable & Sendable, Value: Sendable> {
    private var storage: [Key: Value] = [:]

    func get(_ key: Key) -> Value? { storage[key] }
    func set(_ key: Key, value: Value) { storage[key] = value }
}
```

## 依赖注入

使用带默认参数的协议注入 — 生产使用默认值，测试注入 mock：

```swift
struct UserService {
    private let repository: any UserRepository

    init(repository: any UserRepository = DefaultUserRepository()) {
        self.repository = repository
    }
}
```

## 参考

参阅技能：`swift-actor-persistence` 了解基于 Actor 的持久化模式。
参阅技能：`swift-protocol-di-testing` 了解基于 Protocol 的依赖注入和测试。
