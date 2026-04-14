---
paths:
  - "**/*.swift"
  - "**/Package.swift"
---
# Swift 安全

> 本文件以 Swift 特定内容扩展了 [common/security.md](../common/security.md)。

## 密钥管理

- 敏感数据（令牌、密码、密钥）使用 **Keychain Services** — 永远不用 `UserDefaults`
- 构建时密钥使用环境变量或 `.xcconfig` 文件
- 永远不要在源代码中硬编码密钥 — 反编译工具可以轻易提取它们

```swift
let apiKey = ProcessInfo.processInfo.environment["API_KEY"]
guard let apiKey, !apiKey.isEmpty else {
    fatalError("API_KEY not configured")
}
```

## 传输安全

- App Transport Security（ATS）默认强制执行 — 不要禁用它
- 对关键端点使用证书锁定
- 验证所有服务器证书

## 输入验证

- 在显示前清理所有用户输入以防止注入
- 使用 `URL(string:)` 配合验证而非强制解包
- 在处理前验证来自外部源（API、deep link、剪贴板）的数据
