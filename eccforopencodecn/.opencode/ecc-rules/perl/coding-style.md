---
paths:
  - "**/*.pl"
  - "**/*.pm"
  - "**/*.t"
  - "**/*.psgi"
  - "**/*.cgi"
---
# Perl 编码风格

> 本文件以 Perl 特定内容扩展了 [common/coding-style.md](../common/coding-style.md)。

## 标准

- 始终 `use v5.36`（启用 `strict`、`warnings`、`say`、子程序签名）
- 使用子程序签名 — 永远不要手动解包 `@_`
- 优先使用 `say` 而非带显式换行的 `print`

## 不可变性

- 使用 **Moo** 配合 `is => 'ro'` 和 `Types::Standard` 用于所有属性
- 永远不要直接使用 blessed hashref — 始终使用 Moo/Moose 访问器
- **OO 覆盖说明**：带 `builder` 或 `default` 的 Moo `has` 属性对于计算的只读值是可接受的

## 格式化

使用 **perltidy** 配合以下设置：

```
-i=4    # 4 空格缩进
-l=100  # 100 字符行宽
-ce     # 紧凑 else
-bar    # 开括号始终在右边
```

## 代码检查

使用 **perlcritic** 严重级别 3，主题：`core`、`pbp`、`security`。

```bash
perlcritic --severity 3 --theme 'core || pbp || security' lib/
```

## 参考

参阅技能：`perl-patterns` 了解全面的现代 Perl 惯用写法和最佳实践。
