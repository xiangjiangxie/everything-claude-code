---
paths:
  - "**/*.kt"
  - "**/*.kts"
---
# Kotlin 安全

> 本文件以 Kotlin 和 Android/KMP 特定内容扩展了 [common/security.md](../common/security.md)。

## 密钥管理

- 永远不要在源代码中硬编码 API 密钥、令牌或凭证
- 本地开发密钥使用 `local.properties`（已加入 git-ignored）
- 发布构建使用从 CI 密钥生成的 `BuildConfig` 字段
- 运行时密钥存储使用 `EncryptedSharedPreferences`（Android）或 Keychain（iOS）

```kotlin
// 坏
val apiKey = "sk-abc123..."

// 好 — 来自 BuildConfig（构建时生成）
val apiKey = BuildConfig.API_KEY

// 好 — 运行时从安全存储获取
val token = secureStorage.get("auth_token")
```

## 网络安全

- 专用 HTTPS — 配置 `network_security_config.xml` 阻止明文传输
- 对敏感端点使用 OkHttp `CertificatePinner` 或 Ktor 等效方案进行证书锁定
- 为所有 HTTP 客户端设置超时 — 永远不要使用默认值（可能为无限）
- 在使用前验证和清理所有服务器响应

```xml
<!-- res/xml/network_security_config.xml -->
<network-security-config>
    <base-config cleartextTrafficPermitted="false" />
</network-security-config>
```

## 输入验证

- 在处理或发送到 API 前验证所有用户输入
- 对 Room/SQLDelight 使用参数化查询 — 永远不要将用户输入拼接到 SQL 中
- 清理来自用户输入的文件路径以防止路径遍历

```kotlin
// 坏 — SQL 注入
@Query("SELECT * FROM items WHERE name = '$input'")

// 好 — 参数化
@Query("SELECT * FROM items WHERE name = :input")
fun findByName(input: String): List<ItemEntity>
```

## 数据保护

- 在 Android 上使用 `EncryptedSharedPreferences` 存储敏感的键值数据
- 使用 `@Serializable` 配合显式字段名 — 不要泄露内部属性名
- 不再需要时从内存中清除敏感数据
- 对序列化类使用 `@Keep` 或 ProGuard 规则以防止名称混淆

## 认证

- 将令牌存储在安全存储中，而非普通的 SharedPreferences
- 实现令牌刷新并正确处理 401/403
- 注销时清除所有认证状态（令牌、缓存的用户数据、cookie）
- 对敏感操作使用生物识别认证（`BiometricPrompt`）

## ProGuard / R8

- 为所有序列化模型保留规则（`@Serializable`、Gson、Moshi）
- 为基于反射的库保留规则（Koin、Retrofit）
- 测试发布构建 — 混淆可能默默破坏序列化

## WebView 安全

- 除非明确需要，否则禁用 JavaScript：`settings.javaScriptEnabled = false`
- 在 WebView 中加载前验证 URL
- 永远不要暴露访问敏感数据的 `@JavascriptInterface` 方法
- 使用 `WebViewClient.shouldOverrideUrlLoading()` 控制导航
