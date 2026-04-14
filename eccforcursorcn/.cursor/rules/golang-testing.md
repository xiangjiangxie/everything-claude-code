---
description: "Go 测试，扩展通用规则"
globs: ["**/*.go", "**/go.mod", "**/go.sum"]
alwaysApply: false
---
# Go 测试

> 本文件以 Go 特定内容扩展通用测试规则。

## 框架

使用标准的 `go test` 配合**表驱动测试**。

## 竞态检测

始终使用 `-race` 标志运行：

```bash
go test -race ./...
```

## 覆盖率

```bash
go test -cover ./...
```

## 参考

参见技能：`golang-testing` 获取详细的 Go 测试模式和辅助工具。
