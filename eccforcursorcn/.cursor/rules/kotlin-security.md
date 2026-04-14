---
description: "Kotlin 安全，扩展通用规则"
globs: ["**/*.kt", "**/*.kts", "**/build.gradle.kts"]
alwaysApply: false
---
# Kotlin 安全

> 本文件以 Kotlin 特定内容扩展通用安全规则。

## 密钥管理

```kotlin
val apiKey = System.getenv("API_KEY")
    ?: throw IllegalStateException("API_KEY not configured")
```

## SQL 注入防护

始终使用 Exposed 的参数化查询：

```kotlin
// Good: Parameterized via Exposed DSL
UsersTable.selectAll().where { UsersTable.email eq email }

// Bad: String interpolation in raw SQL
exec("SELECT * FROM users WHERE email = '$email'")
```

## 身份认证

使用 Ktor 的 Auth 插件配合 JWT：

```kotlin
install(Authentication) {
    jwt("jwt") {
        verifier(
            JWT.require(Algorithm.HMAC256(secret))
                .withAudience(audience)
                .withIssuer(issuer)
                .build()
        )
        validate { credential ->
            val payload = credential.payload
            if (payload.audience.contains(audience) &&
                payload.issuer == issuer &&
                payload.subject != null) {
                JWTPrincipal(payload)
            } else {
                null
            }
        }
    }
}
```

## 空安全即安全

Kotlin 的类型系统可以防止与空值相关的漏洞——避免使用 `!!` 以维持这一保障。
