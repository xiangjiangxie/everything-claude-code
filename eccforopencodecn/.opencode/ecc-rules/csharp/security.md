---
paths:
  - "**/*.cs"
  - "**/*.csx"
  - "**/*.csproj"
  - "**/appsettings*.json"
---
# C# 安全

> 本文件以 C# 特定内容扩展了 [common/security.md](../common/security.md)。

## 密钥管理

- 永远不要在源代码中硬编码 API 密钥、令牌或连接字符串
- 本地开发使用环境变量和 user secrets，生产使用密钥管理器
- 保持 `appsettings.*.json` 中不包含真实凭证

```csharp
// 坏
const string ApiKey = "sk-live-123";

// 好
var apiKey = builder.Configuration["OpenAI:ApiKey"]
    ?? throw new InvalidOperationException("OpenAI:ApiKey is not configured.");
```

## SQL 注入防护

- 始终使用 ADO.NET、Dapper 或 EF Core 的参数化查询
- 永远不要将用户输入拼接到 SQL 字符串中
- 使用动态查询组合前验证排序字段和过滤操作符

```csharp
const string sql = "SELECT * FROM Orders WHERE CustomerId = @customerId";
await connection.QueryAsync<Order>(sql, new { customerId });
```

## 输入验证

- 在应用边界验证 DTO
- 使用数据注解、FluentValidation 或显式守卫子句
- 在运行业务逻辑之前拒绝无效的模型状态

## 认证与授权

- 优先使用框架认证处理器而非自定义令牌解析
- 在端点或处理器边界强制执行授权策略
- 永远不要记录原始令牌、密码或 PII

## 错误处理

- 返回安全的面向客户端的消息
- 在服务端使用结构化上下文记录详细异常
- 不要在 API 响应中暴露堆栈跟踪、SQL 文本或文件系统路径

## 参考

参阅技能：`security-review` 了解更广泛的应用安全审查清单。
