---
description: 增量修复 Rust 构建错误、借用检查器问题和依赖问题。调用 rust-build-resolver 智能体进行最小化精确修复。
---

# Rust 构建与修复

此命令调用 **rust-build-resolver** 智能体，以最小变更增量修复 Rust 构建错误。

## 此命令的功能

1. **运行诊断**：执行 `cargo check`、`cargo clippy`、`cargo fmt --check`
2. **解析错误**：识别错误代码和受影响文件
3. **增量修复**：每次修复一个错误
4. **验证每次修复**：每次变更后重新运行 `cargo check`
5. **汇报摘要**：展示已修复和剩余的问题

## 使用场景

在以下情况使用 `/rust-build`：
- `cargo build` 或 `cargo check` 失败报错
- `cargo clippy` 报告警告
- 借用检查器或生命周期错误阻止编译
- Cargo 依赖解析失败
- 拉取变更后构建中断

## 运行的诊断命令

```bash
# 主要构建检查
cargo check 2>&1

# Lint 和建议
cargo clippy -- -D warnings 2>&1

# 格式检查
cargo fmt --check 2>&1

# 依赖问题
cargo tree --duplicates

# 安全审计（如可用）
if command -v cargo-audit >/dev/null; then cargo audit; else echo "cargo-audit not installed"; fi
```

## 示例会话

````text
User: /rust-build

Agent:
# Rust 构建解决

## 初始诊断

```bash
$ cargo check
error[E0502]: cannot borrow `map` as mutable because it is also borrowed as immutable
  --> src/service/cache.rs:25:5
error[E0308]: mismatched types
  --> src/handler/api.rs:42:12
error[E0425]: cannot find value `db` in this scope
  --> src/handler/api.rs:58:9
```

发现错误：3 个

## 修复 1：借用检查器错误

文件：src/service/cache.rs:25
错误：E0502 — 无法将 `map` 作为可变借用，因为它也被不可变借用
原因：可变插入时不可变借用仍然活跃

```rust
// Changed: restructured to end immutable borrow before mutable access
if !map.contains_key("key") {
    map.insert("key".into(), default);
}
```

```bash
$ cargo check
# 剩余 2 个错误
```

## 修复 2：类型不匹配

文件：src/handler/api.rs:42
错误：E0308 — 类型不匹配：预期 `usize`，找到 `&str`

```rust
// Changed
let count = params.get("count");
// To
let count: usize = params.get("count")
    .and_then(|s| s.parse().ok())
    .unwrap_or(0);
```

```bash
$ cargo check
# 剩余 1 个错误
```

## 修复 3：未解析的名称

文件：src/handler/api.rs:58
错误：E0425 — 在此作用域中找不到值 `db`
原因：缺少导入

```rust
// Added
use crate::db;
```

```bash
$ cargo check
# 构建成功！
```

## 最终验证

```bash
$ cargo clippy -- -D warnings
# 无警告

$ cargo test
running 6 tests
test service::cache::tests::test_insert ... ok
test service::cache::tests::test_get ... ok
test handler::api::tests::test_parse_count ... ok
test handler::api::tests::test_missing_count ... ok
test handler::api::tests::test_db_import ... ok
test handler::api::tests::test_response ... ok

test result: ok. 6 passed; 0 failed; 0 ignored
```

## 总结

| 指标 | 数量 |
|--------|-------|
| 修复的构建错误 | 3 |
| 修复的 Clippy 警告 | 0 |
| 修改的文件 | 2 |
| 剩余问题 | 0 |

构建状态：成功
````

## 常见错误修复

| 错误 | 典型修复 |
|-------|-------------|
| `cannot borrow as mutable` | 重构以先结束不可变借用；仅在合理时 clone |
| `does not live long enough` | 使用拥有所有权的类型或添加生命周期标注 |
| `cannot move out of` | 重构以获取所有权；clone 作为最后手段 |
| `mismatched types` | 添加 `.into()`、`as` 或显式转换 |
| `trait X not implemented` | 添加 `#[derive(Trait)]` 或手动实现 |
| `unresolved import` | 添加到 Cargo.toml 或修复 `use` 路径 |
| `cannot find value` | 添加导入或修复路径 |

## 修复策略

1. **先修复构建错误** - 代码必须能编译
2. **其次修复 Clippy 警告** - 修复可疑的构造
3. **再次修复格式** - `cargo fmt` 合规
4. **每次修复一个** - 验证每次变更
5. **最小变更** - 不重构，只修复

## 停止条件

智能体将在以下情况停止并报告：
- 3 次尝试后同一错误仍然存在
- 修复引入了更多错误
- 需要架构层面的变更
- 借用检查器错误需要重新设计数据所有权

## 相关命令

- `/rust-test` - 构建成功后运行测试
- `/rust-review` - 审查代码质量
- `/verify` - 完整验证循环

## 相关资源

- 智能体：`agents/rust-build-resolver.md`
- 技能：`skills/rust-patterns/`
