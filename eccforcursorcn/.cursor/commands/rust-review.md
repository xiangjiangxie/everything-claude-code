---
description: 全面的 Rust 代码审查，涵盖所有权、生命周期、错误处理、unsafe 使用和惯用模式。调用 rust-reviewer 智能体。
---

# Rust 代码审查

此命令调用 **rust-reviewer** 智能体进行全面的 Rust 专项代码审查。

## 此命令的功能

1. **验证自动化检查**：运行 `cargo check`、`cargo clippy -- -D warnings`、`cargo fmt --check` 和 `cargo test` — 如有失败则停止
2. **识别 Rust 变更**：通过 `git diff HEAD~1`（或 PR 时 `git diff main...HEAD`）查找修改的 `.rs` 文件
3. **运行安全审计**：如可用则执行 `cargo audit`
4. **安全扫描**：检查 unsafe 使用、命令注入、硬编码密钥
5. **所有权审查**：分析不必要的 clone、生命周期问题、借用模式
6. **生成报告**：按严重级别分类问题

## 使用场景

在以下情况使用 `/rust-review`：
- 编写或修改 Rust 代码之后
- 提交 Rust 变更之前
- 审查包含 Rust 代码的 Pull Request
- 接手新的 Rust 代码库
- 学习惯用 Rust 模式

## 审查类别

### 严重（必须修复）
- 生产代码路径中未检查的 `unwrap()`/`expect()`
- 没有 `// SAFETY:` 注释记录不变量的 `unsafe`
- 通过查询中的字符串插值导致的 SQL 注入
- 通过 `std::process::Command` 中未验证输入的命令注入
- 硬编码凭证
- 通过裸指针的 use-after-free

### 高（应当修复）
- 为满足借用检查器而不必要的 `.clone()`
- 使用 `String` 参数而 `&str` 或 `impl AsRef<str>` 即可
- 异步上下文中的阻塞操作（`std::thread::sleep`、`std::fs`）
- 共享类型缺少 `Send`/`Sync` 约束
- 业务关键枚举上的通配符 `_ =>` 匹配
- 大函数（>50 行）

### 中（建议改进）
- 热路径中不必要的分配
- 已知大小时缺少 `with_capacity`
- 无正当理由的 clippy 警告抑制
- 公共 API 缺少 `///` 文档
- 考虑在忽略返回值可能是 bug 的非 `must_use` 返回类型上添加 `#[must_use]`

## 自动运行的检查

```bash
# 构建门禁（审查前必须通过）
cargo check

# Lint 和建议
cargo clippy -- -D warnings

# 格式化
cargo fmt --check

# 测试
cargo test

# 安全审计（如可用）
if command -v cargo-audit >/dev/null; then cargo audit; else echo "cargo-audit not installed"; fi
```

## 使用示例

````text
User: /rust-review

Agent:
# Rust 代码审查报告

## 审查的文件
- src/service/user.rs（已修改）
- src/handler/api.rs（已修改）

## 静态分析结果
- 构建：成功
- Clippy：无警告
- 格式化：通过
- 测试：全部通过

## 发现的问题

[严重] 生产路径中未检查的 unwrap
文件：src/service/user.rs:28
问题：对数据库查询结果使用 `.unwrap()`
```rust
let user = db.find_by_id(id).unwrap();  // Panics on missing user
```
修复：附带上下文传播错误
```rust
let user = db.find_by_id(id)
    .context("failed to fetch user")?;
```

[高] 不必要的 Clone
文件：src/handler/api.rs:45
问题：为满足借用检查器而克隆 String
```rust
let name = user.name.clone();
process(&user, &name);
```
修复：重构以避免克隆
```rust
let result = process_name(&user.name);
use_user(&user, result);
```

## 总结
- 严重：1
- 高：1
- 中：0

建议：在严重问题修复前阻止合并
````

## 审批标准

| 状态 | 条件 |
|--------|-----------|
| 批准 | 无严重或高级问题 |
| 警告 | 仅有中级问题（谨慎合并） |
| 阻止 | 发现严重或高级问题 |

## 与其他命令的集成

- 先使用 `/rust-test` 确保测试通过
- 如有构建错误使用 `/rust-build`
- 提交前使用 `/rust-review`
- 对非 Rust 特定问题使用 `/code-review`

## 相关资源

- 智能体：`agents/rust-reviewer.md`
- 技能：`skills/rust-patterns/`、`skills/rust-testing/`
