---
description: "PHP 安全，扩展通用规则"
globs: ["**/*.php", "**/composer.lock", "**/composer.json"]
alwaysApply: false
---
# PHP 安全

> 本文件以 PHP 特定内容扩展通用安全规则。

## 数据库安全

- 对所有动态查询使用预处理语句（`PDO`、Doctrine、Eloquent 查询构建器）。
- 谨慎限定 ORM 批量赋值范围，白名单可写字段。

## 密钥与依赖

- 从环境变量或密钥管理器加载密钥，绝不从已提交的配置文件中加载。
- 在 CI 中运行 `composer audit`，添加依赖前审查包的可信度。

## 认证与会话安全

- 使用 `password_hash()` / `password_verify()` 存储密码。
- 在认证和权限变更后重新生成会话标识符。
- 对状态变更的 Web 请求强制实施 CSRF 保护。
