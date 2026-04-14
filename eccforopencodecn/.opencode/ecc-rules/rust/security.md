---
paths:
  - "**/*.rs"
---
# Rust 安全

> 本文件以 Rust 特定内容扩展了 [common/security.md](../common/security.md)。

## 密钥管理

- 永远不要在源代码中硬编码 API 密钥、令牌或凭证
- 使用环境变量：`std::env::var("API_KEY")`
- 启动时缺少必需密钥应立即失败
- 将 `.env` 文件放入 `.gitignore`

```rust
// 坏
const API_KEY: &str = "sk-abc123...";

// 好 — 环境变量配合早期验证
fn load_api_key() -> anyhow::Result<String> {
    std::env::var("PAYMENT_API_KEY")
        .context("PAYMENT_API_KEY must be set")
}
```

## SQL 注入防护

- 始终使用参数化查询 — 永远不要将用户输入格式化到 SQL 字符串中
- 使用查询构建器或 ORM（sqlx、diesel、sea-orm）配合绑定参数

```rust
// 坏 — 通过格式化字符串导致 SQL 注入
let query = format!("SELECT * FROM users WHERE name = '{name}'");
sqlx::query(&query).fetch_one(&pool).await?;

// 好 — 使用 sqlx 的参数化查询
// 占位符语法因后端而异：Postgres: $1  |  MySQL: ?  |  SQLite: $1
sqlx::query("SELECT * FROM users WHERE name = $1")
    .bind(&name)
    .fetch_one(&pool)
    .await?;
```

## 输入验证

- 在处理前在系统边界验证所有用户输入
- 使用类型系统强制执行不变量（newtype 模式）
- 解析而非验证 — 在边界将非结构化数据转换为类型化结构体
- 以清晰的错误信息拒绝无效输入

```rust
// 解析而非验证 — 非法状态不可表示
pub struct Email(String);

impl Email {
    pub fn parse(input: &str) -> Result<Self, ValidationError> {
        let trimmed = input.trim();
        let at_pos = trimmed.find('@')
            .filter(|&p| p > 0 && p < trimmed.len() - 1)
            .ok_or_else(|| ValidationError::InvalidEmail(input.to_string()))?;
        let domain = &trimmed[at_pos + 1..];
        if trimmed.len() > 254 || !domain.contains('.') {
            return Err(ValidationError::InvalidEmail(input.to_string()));
        }
        // 生产使用时，建议使用经过验证的 email crate（如 `email_address`）
        Ok(Self(trimmed.to_string()))
    }

    pub fn as_str(&self) -> &str {
        &self.0
    }
}
```

## Unsafe 代码

- 最小化 `unsafe` 块 — 优先使用安全抽象
- 每个 `unsafe` 块必须有 `// SAFETY:` 注释说明不变量
- 永远不要使用 `unsafe` 为了方便而绕过借用检查器
- 审查期间审计所有 `unsafe` 代码 — 没有合理理由则视为警示信号
- 优先使用 `safe` 的 FFI 包装来封装 C 库

```rust
// 好 — 安全注释记录了所有必需的不变量
let widget: &Widget = {
    // SAFETY: `ptr` is non-null, aligned, points to an initialized Widget,
    // and no mutable references or mutations exist for its lifetime.
    unsafe { &*ptr }
};

// 坏 — 没有安全说明
unsafe { &*ptr }
```

## 依赖安全

- 运行 `cargo audit` 扫描依赖中的已知 CVE
- 运行 `cargo deny check` 进行许可证和安全公告合规检查
- 使用 `cargo tree` 审计传递依赖
- 保持依赖更新 — 设置 Dependabot 或 Renovate
- 最小化依赖数量 — 添加新 crate 前先评估

```bash
# 安全审计
cargo audit

# 拒绝安全公告、重复版本和受限许可证
cargo deny check

# 检查依赖树
cargo tree
cargo tree -d  # 仅显示重复项
```

## 错误信息

- 永远不要在 API 响应中暴露内部路径、堆栈跟踪或数据库错误
- 在服务端记录详细错误；向客户端返回通用消息
- 使用 `tracing` 或 `log` 进行结构化的服务端日志记录

```rust
// 将错误映射到适当的状态码和通用消息
// （示例使用 axum；请根据你的框架调整响应类型）
match order_service.find_by_id(id) {
    Ok(order) => Ok((StatusCode::OK, Json(order))),
    Err(ServiceError::NotFound(_)) => {
        tracing::info!(order_id = id, "order not found");
        Err((StatusCode::NOT_FOUND, "Resource not found"))
    }
    Err(e) => {
        tracing::error!(order_id = id, error = %e, "unexpected error");
        Err((StatusCode::INTERNAL_SERVER_ERROR, "Internal server error"))
    }
}
```

## 参考

参阅技能：`rust-patterns` 了解 unsafe 代码指南和所有权模式。
参阅技能：`security-review` 了解通用安全检查清单。
