---
description: 为 Rust 强制执行 TDD 工作流。先编写测试，再实现代码。使用 cargo-llvm-cov 验证 80%+ 覆盖率。
---

# Rust TDD 命令

此命令使用 `#[test]`、rstest、proptest 和 mockall 为 Rust 代码强制执行测试驱动开发方法论。

## 此命令的功能

1. **定义类型/Trait**：使用 `todo!()` 搭建函数签名
2. **编写测试**：创建全面的测试模块（RED）
3. **运行测试**：验证测试因正确原因失败
4. **实现代码**：编写最少代码使测试通过（GREEN）
5. **重构**：在保持测试通过的同时改进代码
6. **检查覆盖率**：使用 cargo-llvm-cov 确保 80%+ 覆盖率

## 使用场景

在以下情况使用 `/rust-test`：
- 实现新的 Rust 函数、方法或 trait
- 为已有 Rust 代码添加测试覆盖率
- 修复 bug（先编写失败测试）
- 构建关键业务逻辑
- 在 Rust 中学习 TDD 工作流

## TDD 循环

```
RED     -> 先编写失败的测试
GREEN   -> 实现最少代码使测试通过
REFACTOR -> 改进代码，保持测试通过
REPEAT  -> 下一个测试用例
```

## 示例会话

````text
User: /rust-test I need a function to validate user registration

Agent:
# TDD 会话：注册验证器

## 第 1 步：定义接口

```rust
// src/validator.rs
pub struct RegistrationRequest {
    pub name: String,
    pub email: String,
    pub password: String,
}

pub enum ValidationResult {
    Valid,
    Invalid(Vec<String>),
}

pub fn validate_registration(request: &RegistrationRequest) -> ValidationResult {
    todo!()
}
```

## 第 2 步：编写测试（RED）

```rust
#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn valid_registration_returns_valid() {
        let request = RegistrationRequest {
            name: "Alice".into(),
            email: "alice@example.com".into(),
            password: "SecureP@ss1".into(),
        };
        assert!(matches!(validate_registration(&request), ValidationResult::Valid));
    }

    #[test]
    fn blank_name_returns_invalid() {
        let request = RegistrationRequest {
            name: "".into(),
            email: "alice@example.com".into(),
            password: "SecureP@ss1".into(),
        };
        match validate_registration(&request) {
            ValidationResult::Invalid(errors) => {
                assert!(errors.contains(&"Name is required".to_string()));
            }
            ValidationResult::Valid => panic!("expected Invalid"),
        }
    }

    #[test]
    fn invalid_email_returns_invalid() {
        let request = RegistrationRequest {
            name: "Alice".into(),
            email: "not-an-email".into(),
            password: "SecureP@ss1".into(),
        };
        assert!(matches!(
            validate_registration(&request),
            ValidationResult::Invalid(_)
        ));
    }

    #[test]
    fn short_password_returns_invalid() {
        let request = RegistrationRequest {
            name: "Alice".into(),
            email: "alice@example.com".into(),
            password: "short".into(),
        };
        assert!(matches!(
            validate_registration(&request),
            ValidationResult::Invalid(_)
        ));
    }
}
```

## 第 3 步：运行测试 — 验证失败

```bash
$ cargo test
running 4 tests
test tests::valid_registration_returns_valid ... FAILED (not yet implemented)
test tests::blank_name_returns_invalid ... FAILED
test tests::invalid_email_returns_invalid ... FAILED
test tests::short_password_returns_invalid ... FAILED
```

测试按预期失败（todo! panic）。

## 第 4 步：实现最少代码（GREEN）

```rust
pub fn validate_registration(request: &RegistrationRequest) -> ValidationResult {
    let mut errors = Vec::new();

    if request.name.trim().is_empty() {
        errors.push("Name is required".into());
    }
    if !request.email.contains('@') {
        errors.push("Invalid email format".into());
    }
    if request.password.len() < 8 {
        errors.push("Password must be at least 8 characters".into());
    }

    if errors.is_empty() {
        ValidationResult::Valid
    } else {
        ValidationResult::Invalid(errors)
    }
}
```

## 第 5 步：运行测试 — 验证通过

```bash
$ cargo test
running 4 tests
test tests::valid_registration_returns_valid ... ok
test tests::blank_name_returns_invalid ... ok
test tests::invalid_email_returns_invalid ... ok
test tests::short_password_returns_invalid ... ok

test result: ok. 4 passed; 0 failed
```

所有测试通过！

## 第 6 步：检查覆盖率

```bash
$ cargo llvm-cov
Coverage: 100.0% of lines
```

覆盖率：100%

## TDD 完成！
````

## 测试模式

### 单元测试

```rust
#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn adds_two_numbers() {
        assert_eq!(add(2, 3), 5);
    }

    #[test]
    fn handles_error() -> Result<(), Box<dyn std::error::Error>> {
        let result = parse_config(r#"port = 8080"#)?;
        assert_eq!(result.port, 8080);
        Ok(())
    }
}
```

### 使用 rstest 的参数化测试

```rust
use rstest::{rstest, fixture};

#[rstest]
#[case("hello", 5)]
#[case("", 0)]
#[case("rust", 4)]
fn test_string_length(#[case] input: &str, #[case] expected: usize) {
    assert_eq!(input.len(), expected);
}
```

### 异步测试

```rust
#[tokio::test]
async fn fetches_data_successfully() {
    let client = TestClient::new().await;
    let result = client.get("/data").await;
    assert!(result.is_ok());
}
```

### 基于属性的测试

```rust
use proptest::prelude::*;

proptest! {
    #[test]
    fn encode_decode_roundtrip(input in ".*") {
        let encoded = encode(&input);
        let decoded = decode(&encoded).unwrap();
        assert_eq!(input, decoded);
    }
}
```

## 覆盖率命令

```bash
# 摘要报告
cargo llvm-cov

# HTML 报告
cargo llvm-cov --html

# 低于阈值则失败
cargo llvm-cov --fail-under-lines 80

# 运行特定测试
cargo test test_name

# 带输出运行
cargo test -- --nocapture

# 不在第一个失败时停止
cargo test --no-fail-fast
```

## 覆盖率目标

| 代码类型 | 目标 |
|-----------|--------|
| 关键业务逻辑 | 100% |
| 公共 API | 90%+ |
| 通用代码 | 80%+ |
| 生成的代码 / FFI 绑定 | 排除 |

## TDD 最佳实践

**应该做的：**
- 在任何实现之前先编写测试
- 每次更改后运行测试
- 使用 `assert_eq!` 而非 `assert!` 以获得更好的错误消息
- 在返回 `Result` 的测试中使用 `?` 以获得更清晰的输出
- 测试行为，而非实现
- 包含边界情况（空值、边界、错误路径）

**不应该做的：**
- 在测试之前编写实现
- 跳过 RED 阶段
- 当 `Result::is_err()` 可行时使用 `#[should_panic]`
- 在测试中使用 `sleep()` — 使用 channel 或 `tokio::time::pause()`
- mock 所有东西 — 可行时优先使用集成测试

## 相关命令

- `/rust-build` - 修复构建错误
- `/rust-review` - 实现后审查代码
- `/verify` - 运行完整验证循环

## 相关资源

- 技能：`skills/rust-testing/`
- 技能：`skills/rust-patterns/`
