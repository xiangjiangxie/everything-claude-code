---
paths:
  - "**/*.pl"
  - "**/*.pm"
  - "**/*.t"
  - "**/*.psgi"
  - "**/*.cgi"
---
# Perl 测试

> 本文件以 Perl 特定内容扩展了 [common/testing.md](../common/testing.md)。

## 框架

新项目使用 **Test2::V0**（而非 Test::More）：

```perl
use Test2::V0;

is($result, 42, 'answer is correct');

done_testing;
```

## 运行器

```bash
prove -l t/              # 将 lib/ 添加到 @INC
prove -lr -j8 t/         # 递归，8 个并行任务
```

始终使用 `-l` 确保 `lib/` 在 `@INC` 路径中。

## 覆盖率

使用 **Devel::Cover** — 目标 80%+：

```bash
cover -test
```

## Mock

- **Test::MockModule** — mock 现有模块的方法
- **Test::MockObject** — 从零创建测试替身

## 注意事项

- 测试文件始终以 `done_testing` 结尾
- 使用 `prove` 时永远不要忘记 `-l` 标志

## 参考

参阅技能：`perl-testing` 了解详细的 Perl TDD 模式，含 Test2::V0、prove 和 Devel::Cover。
