---
paths:
  - "**/*.php"
  - "**/composer.lock"
  - "**/composer.json"
---
# PHP 安全

> 本文件以 PHP 特定内容扩展了 [common/security.md](../common/security.md)。

## 输入与输出

- 在框架边界验证请求输入（`FormRequest`、Symfony Validator 或显式 DTO 验证）。
- 模板中默认转义输出；将原始 HTML 渲染视为必须说明理由的例外。
- 未经验证不要信任查询参数、cookie、头信息或上传文件的元数据。

## 数据库安全

- 对所有动态查询使用预处理语句（`PDO`、Doctrine、Eloquent 查询构建器）。
- 避免在控制器/视图中拼接 SQL 字符串。
- 谨慎设置 ORM 的批量赋值作用域，白名单列出可写字段。

## 密钥与依赖

- 从环境变量或密钥管理器加载密钥，永远不要从已提交的配置文件中加载。
- 在 CI 中运行 `composer audit`，添加依赖前审查新包维护者的可信度。
- 有意识地锁定主版本，快速移除已废弃的包。

## 认证与会话安全

- 使用 `password_hash()` / `password_verify()` 存储密码。
- 在认证和权限变更后重新生成会话标识符。
- 对状态变更的 Web 请求强制执行 CSRF 保护。

## 参考

参阅技能：`laravel-security` 了解 Laravel 特定的安全指导。
