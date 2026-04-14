---
paths:
  - "**/*.cs"
  - "**/*.csx"
  - "**/*.csproj"
  - "**/*.sln"
  - "**/Directory.Build.props"
  - "**/Directory.Build.targets"
---
# C# 钩子

> 本文件以 C# 特定内容扩展了 [common/hooks.md](../common/hooks.md)。

## PostToolUse 钩子

在 `~/.claude/settings.json` 中配置：

- **dotnet format**：自动格式化编辑的 C# 文件并应用分析器修复
- **dotnet build**：编辑后验证解决方案或项目仍能编译
- **dotnet test --no-build**：行为变更后重新运行最近的相关测试项目

## Stop 钩子

- 在包含大量 C# 变更的会话结束前运行最终的 `dotnet build`
- 对修改的 `appsettings*.json` 文件发出警告，防止密钥被提交
