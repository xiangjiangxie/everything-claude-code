---
description: "Swift 安全，扩展通用规则"
globs: ["**/*.swift", "**/Package.swift"]
alwaysApply: false
---
# Swift 安全

> 本文件以 Swift 特定内容扩展通用安全规则。

## 密钥管理

- 使用 **Keychain Services** 存储敏感数据（令牌、密码、密钥）——绝不使用 `UserDefaults`
- 使用环境变量或 `.xcconfig` 文件存储构建时密钥
- 绝不在源代码中硬编码密钥——反编译工具可以轻易提取

```swift
let apiKey = ProcessInfo.processInfo.environment["API_KEY"]
guard let apiKey, !apiKey.isEmpty else {
    fatalError("API_KEY not configured")
}
```

## 传输安全

- App Transport Security (ATS) 默认强制执行——不要禁用
- 对关键端点使用证书固定
- 验证所有服务器证书

## 输入验证

- 在显示前对所有用户输入进行清理以防止注入
- 使用 `URL(string:)` 配合验证，而非强制解包
- 在处理前验证来自外部源（API、深度链接、剪贴板）的数据
