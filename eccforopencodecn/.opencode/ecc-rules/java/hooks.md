---
paths:
  - "**/*.java"
  - "**/pom.xml"
  - "**/build.gradle"
  - "**/build.gradle.kts"
---
# Java 钩子

> 本文件以 Java 特定内容扩展了 [common/hooks.md](../common/hooks.md)。

## PostToolUse 钩子

在 `~/.claude/settings.json` 中配置：

- **google-java-format**：编辑后自动格式化 `.java` 文件
- **checkstyle**：编辑 Java 文件后运行风格检查
- **./mvnw compile** 或 **./gradlew compileJava**：变更后验证编译
