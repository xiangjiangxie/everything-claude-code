---
paths:
  - "**/*.rs"
---
# Rust 测试

> 本文件以 Rust 特定内容扩展了 [common/testing.md](../common/testing.md)。

## 测试框架

- **`#[test]`** 配合 `#[cfg(test)]` 模块用于单元测试
- **rstest** 用于参数化测试和 fixtures
- **proptest** 用于属性基测试
- **mockall** 用于基于 trait 的 mock
- **`#[tokio::test]`** 用于异步测试

## 测试组织

```text
my_crate/
├── src/
│   ├── lib.rs           # 单元测试在 #[cfg(test)] 模块中
│   ├── auth/
│   │   └── mod.rs       # #[cfg(test)] mod tests { ... }
│   └── orders/
│       └── service.rs   # #[cfg(test)] mod tests { ... }
├── tests/               # 集成测试（每个文件 = 独立二进制文件）
│   ├── api_test.rs
│   ├── db_test.rs
│   └── common/          # 共享测试工具
│       └── mod.rs
└── benches/             # Criterion 基准测试
    └── benchmark.rs
```

单元测试放在同一文件的 `#[cfg(test)]` 模块中。集成测试放在 `tests/` 目录中。

## 单元测试模式

```rust
#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn creates_user_with_valid_email() {
        let user = User::new("Alice", "alice@example.com").unwrap();
        assert_eq!(user.name, "Alice");
    }

    #[test]
    fn rejects_invalid_email() {
        let result = User::new("Bob", "not-an-email");
        assert!(result.is_err());
        assert!(result.unwrap_err().to_string().contains("invalid email"));
    }
}
```

## 参数化测试

```rust
use rstest::rstest;

#[rstest]
#[case("hello", 5)]
#[case("", 0)]
#[case("rust", 4)]
fn test_string_length(#[case] input: &str, #[case] expected: usize) {
    assert_eq!(input.len(), expected);
}
```

## 异步测试

```rust
#[tokio::test]
async fn fetches_data_successfully() {
    let client = TestClient::new().await;
    let result = client.get("/data").await;
    assert!(result.is_ok());
}
```

## 使用 mockall 进行 Mock

在生产代码中定义 trait；在测试模块中生成 mock：

```rust
// 生产 trait — pub 以便集成测试可以导入
pub trait UserRepository {
    fn find_by_id(&self, id: u64) -> Option<User>;
}

#[cfg(test)]
mod tests {
    use super::*;
    use mockall::predicate::eq;

    mockall::mock! {
        pub Repo {}
        impl UserRepository for Repo {
            fn find_by_id(&self, id: u64) -> Option<User>;
        }
    }

    #[test]
    fn service_returns_user_when_found() {
        let mut mock = MockRepo::new();
        mock.expect_find_by_id()
            .with(eq(42))
            .times(1)
            .returning(|_| Some(User { id: 42, name: "Alice".into() }));

        let service = UserService::new(Box::new(mock));
        let user = service.get_user(42).unwrap();
        assert_eq!(user.name, "Alice");
    }
}
```

## 测试命名

使用描述场景的描述性名称：
- `creates_user_with_valid_email()`
- `rejects_order_when_insufficient_stock()`
- `returns_none_when_not_found()`

## 覆盖率

- 目标 80%+ 行覆盖率
- 使用 **cargo-llvm-cov** 生成覆盖率报告
- 聚焦业务逻辑 — 排除生成代码和 FFI 绑定

```bash
cargo llvm-cov                       # 摘要
cargo llvm-cov --html                # HTML 报告
cargo llvm-cov --fail-under-lines 80 # 低于阈值时失败
```

## 测试命令

```bash
cargo test                       # 运行所有测试
cargo test -- --nocapture        # 显示 println 输出
cargo test test_name             # 运行匹配模式的测试
cargo test --lib                 # 仅单元测试
cargo test --test api_test       # 特定集成测试（tests/api_test.rs）
cargo test --doc                 # 仅文档测试
```

## 参考

参阅技能：`rust-testing` 了解全面的测试模式，包括属性基测试、fixtures 和使用 Criterion 的基准测试。
