---
paths:
  - "**/*.java"
---
# Java 安全

> 本文件以 Java 特定内容扩展了 [common/security.md](../common/security.md)。

## 密钥管理

- 永远不要在源代码中硬编码 API 密钥、令牌或凭证
- 使用环境变量：`System.getenv("API_KEY")`
- 生产环境使用密钥管理器（Vault、AWS Secrets Manager）
- 将包含密钥的本地配置文件放入 `.gitignore`

```java
// 坏
private static final String API_KEY = "sk-abc123...";

// 好 — 环境变量
String apiKey = System.getenv("PAYMENT_API_KEY");
Objects.requireNonNull(apiKey, "PAYMENT_API_KEY must be set");
```

## SQL 注入防护

- 始终使用参数化查询 — 永远不要将用户输入拼接到 SQL 中
- 使用 `PreparedStatement` 或框架的参数化查询 API
- 验证和清理用于原生查询的所有输入

```java
// 坏 — 通过字符串拼接导致 SQL 注入
Statement stmt = conn.createStatement();
String sql = "SELECT * FROM orders WHERE name = '" + name + "'";
stmt.executeQuery(sql);

// 好 — 使用参数化查询的 PreparedStatement
PreparedStatement ps = conn.prepareStatement("SELECT * FROM orders WHERE name = ?");
ps.setString(1, name);

// 好 — JDBC template
jdbcTemplate.query("SELECT * FROM orders WHERE name = ?", mapper, name);
```

## 输入验证

- 在处理前在系统边界验证所有用户输入
- 使用验证框架时在 DTO 上使用 Bean Validation（`@NotNull`、`@NotBlank`、`@Size`）
- 在使用前清理文件路径和用户提供的字符串
- 以清晰的错误信息拒绝验证失败的输入

```java
// 在纯 Java 中手动验证
public Order createOrder(String customerName, BigDecimal amount) {
    if (customerName == null || customerName.isBlank()) {
        throw new IllegalArgumentException("Customer name is required");
    }
    if (amount == null || amount.compareTo(BigDecimal.ZERO) <= 0) {
        throw new IllegalArgumentException("Amount must be positive");
    }
    return new Order(customerName, amount);
}
```

## 认证与授权

- 永远不要实现自定义认证加密 — 使用成熟的库
- 使用 bcrypt 或 Argon2 存储密码，永远不用 MD5/SHA1
- 在服务边界强制执行授权检查
- 从日志中清除敏感数据 — 永远不要记录密码、令牌或 PII

## 依赖安全

- 运行 `mvn dependency:tree` 或 `./gradlew dependencies` 审计传递依赖
- 使用 OWASP Dependency-Check 或 Snyk 扫描已知 CVE
- 保持依赖更新 — 设置 Dependabot 或 Renovate

## 错误信息

- 永远不要在 API 响应中暴露堆栈跟踪、内部路径或 SQL 错误
- 在处理器边界将异常映射为安全的通用客户端消息
- 在服务端记录详细错误；向客户端返回通用消息

```java
// 记录详情，返回通用消息
try {
    return orderService.findById(id);
} catch (OrderNotFoundException ex) {
    log.warn("Order not found: id={}", id);
    return ApiResponse.error("Resource not found");  // 通用消息，无内部信息
} catch (Exception ex) {
    log.error("Unexpected error processing order id={}", id, ex);
    return ApiResponse.error("Internal server error");  // 永远不暴露 ex.getMessage()
}
```

## 参考

参阅技能：`springboot-security` 了解 Spring Security 认证和授权模式。
参阅技能：`security-review` 了解通用安全检查清单。
