---
paths:
  - "**/*.rs"
---
# Rust 编码风格

> 本文件以 Rust 特定内容扩展了 [common/coding-style.md](../common/coding-style.md)。

## 格式化

- **rustfmt** 用于强制执行 — 提交前始终运行 `cargo fmt`
- **clippy** 用于 lint — `cargo clippy -- -D warnings`（将警告视为错误）
- 4 空格缩进（rustfmt 默认）
- 最大行宽：100 字符（rustfmt 默认）

## 不可变性

Rust 变量默认不可变 — 拥抱这一特性：

- 默认使用 `let`；仅在需要变更时使用 `let mut`
- 优先返回新值而非原地修改
- 当函数可能需要也可能不需要分配时使用 `Cow<'_, T>`

```rust
use std::borrow::Cow;

// 好 — 默认不可变，返回新值
fn normalize(input: &str) -> Cow<'_, str> {
    if input.contains(' ') {
        Cow::Owned(input.replace(' ', "_"))
    } else {
        Cow::Borrowed(input)
    }
}

// 坏 — 不必要的变更
fn normalize_bad(input: &mut String) {
    *input = input.replace(' ', "_");
}
```

## 命名

遵循标准 Rust 约定：
- `snake_case` 用于函数、方法、变量、模块、crate
- `PascalCase`（UpperCamelCase）用于类型、trait、枚举、类型参数
- `SCREAMING_SNAKE_CASE` 用于常量和静态变量
- 生命周期：短的小写字母（`'a`、`'de`）— 复杂情况使用描述性名称（`'input`）

## 所有权与借用

- 默认借用（`&T`）；仅在需要存储或消费时取得所有权
- 不要为了满足借用检查器而无脑 clone — 先理解根本原因
- 函数参数中接受 `&str` 而非 `String`，`&[T]` 而非 `Vec<T>`
- 对需要拥有 `String` 的构造函数使用 `impl Into<String>`

```rust
// 好 — 不需要所有权时借用
fn word_count(text: &str) -> usize {
    text.split_whitespace().count()
}

// 好 — 构造函数通过 Into 取得所有权
fn new(name: impl Into<String>) -> Self {
    Self { name: name.into() }
}

// 坏 — &str 即可时却接受 String
fn word_count_bad(text: String) -> usize {
    text.split_whitespace().count()
}
```

## 错误处理

- 使用 `Result<T, E>` 和 `?` 进行传播 — 生产代码中永远不要 `unwrap()`
- **库**：使用 `thiserror` 定义类型化错误
- **应用**：使用 `anyhow` 实现灵活的错误上下文
- 使用 `.with_context(|| format!("failed to ..."))?` 添加上下文
- 将 `unwrap()` / `expect()` 保留给测试和真正不可达的状态

```rust
// 好 — 使用 thiserror 的库错误
#[derive(Debug, thiserror::Error)]
pub enum ConfigError {
    #[error("failed to read config: {0}")]
    Io(#[from] std::io::Error),
    #[error("invalid config format: {0}")]
    Parse(String),
}

// 好 — 使用 anyhow 的应用错误
use anyhow::Context;

fn load_config(path: &str) -> anyhow::Result<Config> {
    let content = std::fs::read_to_string(path)
        .with_context(|| format!("failed to read {path}"))?;
    toml::from_str(&content)
        .with_context(|| format!("failed to parse {path}"))
}
```

## 迭代器优先于循环

转换操作优先使用迭代器链；复杂控制流使用循环：

```rust
// 好 — 声明式且可组合
let active_emails: Vec<&str> = users.iter()
    .filter(|u| u.is_active)
    .map(|u| u.email.as_str())
    .collect();

// 好 — 带提前返回的复杂逻辑使用循环
for user in &users {
    if let Some(verified) = verify_email(&user.email)? {
        send_welcome(&verified)?;
    }
}
```

## 模块组织

按领域组织，而非按类型：

```text
src/
├── main.rs
├── lib.rs
├── auth/           # 领域模块
│   ├── mod.rs
│   ├── token.rs
│   └── middleware.rs
├── orders/         # 领域模块
│   ├── mod.rs
│   ├── model.rs
│   └── service.rs
└── db/             # 基础设施
    ├── mod.rs
    └── pool.rs
```

## 可见性

- 默认私有；内部共享使用 `pub(crate)`
- 仅将属于 crate 公共 API 的内容标记为 `pub`
- 从 `lib.rs` 重导出公共 API

## 参考

参阅技能：`rust-patterns` 了解全面的 Rust 惯用写法和模式。
