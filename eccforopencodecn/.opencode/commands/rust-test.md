---
description: Rust TDD 工作流，包含单元测试和属性测试
agent: tdd-guide
subtask: true
---

# Rust 测试命令

使用 Rust TDD 方法论进行实现：$ARGUMENTS

## 你的任务

运用 Rust 惯用方式进行测试驱动开发：

1. **定义类型** - 结构体、枚举、trait
2. **编写测试** - `#[cfg(test)]` 模块中的单元测试
3. **实现最小代码** - 通过测试
4. **检查覆盖率** - 目标 80% 以上

## Rust 的 TDD 循环

### 步骤 1：定义接口
```rust
pub struct Input {
    // fields
}

pub fn process(input: &Input) -> Result<Output, Error> {
    todo!()
}
```

### 步骤 2：编写测试
```rust
#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn valid_input_succeeds() {
        let input = Input { /* ... */ };
        let result = process(&input);
        assert!(result.is_ok());
    }

    #[test]
    fn invalid_input_returns_error() {
        let input = Input { /* ... */ };
        let result = process(&input);
        assert!(result.is_err());
    }
}
```

### 步骤 3：运行测试（红色阶段）
```bash
cargo test
```

### 步骤 4：实现（绿色阶段）
```rust
pub fn process(input: &Input) -> Result<Output, Error> {
    // Minimal implementation that handles both paths
    validate(input)?;
    Ok(Output { /* ... */ })
}
```

### 步骤 5：检查覆盖率
```bash
cargo llvm-cov
cargo llvm-cov --fail-under-lines 80
```

## Rust 测试命令

```bash
cargo test                        # 运行所有测试
cargo test -- --nocapture         # 显示 println 输出
cargo test test_name              # 运行特定测试
cargo test --no-fail-fast         # 不在第一个失败时停止
cargo test --lib                  # 仅单元测试
cargo test --test integration     # 仅集成测试
cargo test --doc                  # 仅文档测试
cargo bench                       # 运行基准测试
```

## 测试文件组织

```
src/
├── lib.rs             # 库根
├── service.rs         # 实现
└── service/
    └── tests.rs       # 或内联 #[cfg(test)] mod tests {}
tests/
└── integration.rs     # 集成测试
benches/
└── benchmark.rs       # Criterion 基准测试
```

---

**提示**：使用 `rstest` 进行参数化测试，使用 `proptest` 进行属性测试。
