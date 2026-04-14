---
description: 从 ~/.claude/session-data/ 加载最近的会话文件，并从上次会话结束的地方恢复工作，带有完整上下文。
---

# 恢复会话命令

加载上次保存的会话状态，在开始任何工作之前完全理解上下文。
此命令是 `/save-session` 的配套命令。

## 使用场景

- 开始新会话以继续前一天的工作
- 因上下文限制而开始新会话后
- 当从其他来源接收到会话文件时（只需提供文件路径）
- 任何时候有会话文件并希望 Claude 在继续之前完全吸收它

## 用法

```
/resume-session                                                      # 加载 ~/.claude/session-data/ 中最近的文件
/resume-session 2024-01-15                                           # 加载该日期最近的会话
/resume-session ~/.claude/session-data/2024-01-15-abc123de-session.tmp  # 加载当前短 ID 格式的会话文件
/resume-session ~/.claude/sessions/2024-01-15-session.tmp               # 加载特定的旧格式文件
```

## 流程

### 第 1 步：查找会话文件

如未提供参数：

1. 检查 `~/.claude/session-data/`
2. 选择最近修改的 `*-session.tmp` 文件
3. 如果文件夹不存在或没有匹配文件，告知用户：
   ```
   在 ~/.claude/session-data/ 中未找到会话文件
   在会话结束时运行 /save-session 来创建一个。
   ```
   然后停止。

如提供了参数：

- 如果看起来像日期（`YYYY-MM-DD`），先搜索 `~/.claude/session-data/`，然后搜索旧的
  `~/.claude/sessions/`，查找匹配 `YYYY-MM-DD-session.tmp`（旧格式）或
  `YYYY-MM-DD-<shortid>-session.tmp`（当前格式）的文件，
  并加载该日期最近修改的变体
- 如果看起来像文件路径，直接读取该文件
- 如果未找到，清楚报告并停止

### 第 2 步：读取完整会话文件

读取完整文件。暂不摘要。

### 第 3 步：确认理解

以以下确切格式回复结构化简报：

```
SESSION LOADED: [实际解析的文件路径]
════════════════════════════════════════════════

PROJECT: [文件中的项目名称 / 主题]

WHAT WE'RE BUILDING:
[用自己的话 2-3 句话总结]

CURRENT STATE:
✅ Working: [已确认的项目数]
🔄 In Progress: [列出进行中的文件]
🗒️ Not Started: [列出计划但未动的]

WHAT NOT TO RETRY:
[列出每个失败的方案及原因 — 这很关键]

OPEN QUESTIONS / BLOCKERS:
[列出阻塞项或未回答的问题]

NEXT STEP:
[如文件中已定义的确切下一步]
[如未定义："未定义下一步 — 建议在开始前一起审查'尚未尝试的内容'"]

════════════════════════════════════════════════
准备继续。你想做什么？
```

### 第 4 步：等待用户

不要自动开始工作。不要碰任何文件。等待用户说要做什么。

如果会话文件中明确定义了下一步且用户说"继续"或"好的"或类似的话 — 按确切的下一步执行。

如果没有定义下一步 — 询问用户从哪里开始，并可选地从"尚未尝试的内容"部分建议方案。

---

## 边界情况

**同一日期的多个会话**（`2024-01-15-session.tmp`、`2024-01-15-abc123de-session.tmp`）：
加载该日期最近修改的匹配文件，无论使用旧的无 ID 格式还是当前的短 ID 格式。

**会话文件引用了已不存在的文件：**
在简报中注明 — "⚠️ `path/to/file.ts` 在会话中引用但在磁盘上未找到。"

**会话文件超过 7 天前：**
注明时间差 — "⚠️ 此会话来自 N 天前（阈值：7 天）。情况可能已经变化。" — 然后正常继续。

**用户直接提供文件路径（例如从队友转发的）：**
读取并遵循相同的简报流程 — 无论来源，格式相同。

**会话文件为空或格式错误：**
报告："会话文件已找到但似乎为空或不可读。你可能需要使用 /save-session 创建新的。"

---

## 输出示例

```
SESSION LOADED: /Users/you/.claude/session-data/2024-01-15-abc123de-session.tmp
════════════════════════════════════════════════

PROJECT: my-app — JWT 认证

WHAT WE'RE BUILDING:
使用存储在 httpOnly cookie 中的 JWT token 进行用户认证。
注册和登录端点已部分完成。通过中间件的路由保护
尚未开始。

CURRENT STATE:
✅ Working: 3 项（注册端点、JWT 生成、密码哈希）
🔄 In Progress: app/api/auth/login/route.ts（token 可用，cookie 尚未设置）
🗒️ Not Started: middleware.ts、app/login/page.tsx

WHAT NOT TO RETRY:
❌ Next-Auth — 与自定义 Prisma 适配器冲突，每次请求都抛出适配器错误
❌ 用 localStorage 存储 JWT — 导致 SSR hydration 不匹配，与 Next.js 不兼容

OPEN QUESTIONS / BLOCKERS:
- cookies().set() 在 Route Handler 中可用还是仅在 Server Actions 中可用？

NEXT STEP:
在 app/api/auth/login/route.ts 中 — 使用
cookies().set('token', jwt, { httpOnly: true, secure: true, sameSite: 'strict' }) 将 JWT 设置为 httpOnly cookie，
然后用 Postman 测试响应中的 Set-Cookie 头。

════════════════════════════════════════════════
准备继续。你想做什么？
```

---

## 注意事项

- 加载会话文件时绝不修改它 — 它是只读的历史记录
- 简报格式是固定的 — 即使章节为空也不要跳过
- "不要重试的内容"必须始终显示，即使只是"无" — 这太重要不能遗漏
- 恢复后，用户可能想在新会话结束时再次运行 `/save-session` 创建新的日期文件
