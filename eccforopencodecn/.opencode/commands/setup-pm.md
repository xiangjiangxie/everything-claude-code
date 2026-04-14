---
description: 配置包管理器偏好
agent: build
---

# 设置包管理器命令

配置你偏好的包管理器：$ARGUMENTS

## 你的任务

为项目或全局设置包管理器偏好。

## 检测顺序

1. **环境变量**：`CLAUDE_PACKAGE_MANAGER`
2. **项目配置**：`.claude/package-manager.json`
3. **package.json**：`packageManager` 字段
4. **锁文件**：从锁文件自动检测
5. **全局配置**：`~/.claude/package-manager.json`
6. **兜底**：第一个可用的

## 配置选项

### 选项 1：环境变量
```bash
export CLAUDE_PACKAGE_MANAGER=pnpm
```

### 选项 2：项目配置
```bash
# 创建 .claude/package-manager.json
echo '{"packageManager": "pnpm"}' > .claude/package-manager.json
```

### 选项 3：package.json
```json
{
  "packageManager": "pnpm@8.0.0"
}
```

### 选项 4：全局配置
```bash
# 创建 ~/.claude/package-manager.json
echo '{"packageManager": "yarn"}' > ~/.claude/package-manager.json
```

## 支持的包管理器

| 管理器 | 锁文件 | 命令 |
|---------|-----------|----------|
| npm | package-lock.json | `npm install`、`npm run` |
| pnpm | pnpm-lock.yaml | `pnpm install`、`pnpm run` |
| yarn | yarn.lock | `yarn install`、`yarn run` |
| bun | bun.lockb | `bun install`、`bun run` |

## 验证

检查当前设置：
```bash
node scripts/setup-package-manager.js --detect
```

---

**提示**：为了团队一致性，在 package.json 中添加 `packageManager` 字段。
