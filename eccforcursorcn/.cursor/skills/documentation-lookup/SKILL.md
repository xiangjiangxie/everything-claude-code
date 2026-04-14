---
name: documentation-lookup
description: 通过 Context7 MCP 使用最新的库和框架文档，而非训练数据。当用户提出设置问题、API 参考、代码示例或提到某个框架（如 React、Next.js、Prisma）时激活。
origin: ECC
---

# 文档查询（Context7）

当用户询问库、框架或 API 时，通过 Context7 MCP（工具 `resolve-library-id` 和 `query-docs`）获取最新文档，而非依赖训练数据。

## 核心概念

- **Context7**：提供实时文档的 MCP 服务器；用它替代训练数据来查询库和 API 信息。
- **resolve-library-id**：根据库名和查询返回 Context7 兼容的库 ID（如 `/vercel/next.js`）。
- **query-docs**：根据给定的库 ID 和问题获取文档和代码片段。必须先调用 resolve-library-id 获取有效的库 ID。

## 何时使用

在以下情况下激活：

- 用户提出设置或配置问题（如"如何配置 Next.js middleware？"）
- 用户请求依赖某个库的代码（"用 Prisma 写一个查询..."）
- 用户需要 API 或参考信息（"Supabase 有哪些认证方法？"）
- 用户提到特定的框架或库（React、Vue、Svelte、Express、Tailwind、Prisma、Supabase 等）

当请求依赖于某个库、框架或 API 的准确、最新行为时使用此技能。适用于配置了 Context7 MCP 的所有平台（如 Claude Code、Cursor、Codex）。

## 工作原理

### 步骤 1：解析库 ID

调用 **resolve-library-id** MCP 工具，参数为：

- **libraryName**：从用户问题中提取的库或产品名称（如 `Next.js`、`Prisma`、`Supabase`）。
- **query**：用户的完整问题。这有助于提高结果的相关性排序。

必须在查询文档之前获取 Context7 兼容的库 ID（格式为 `/org/project` 或 `/org/project/version`）。不要在没有此步骤获取的有效库 ID 的情况下调用 query-docs。

### 步骤 2：选择最佳匹配

从解析结果中选择一个结果，依据：

- **名称匹配**：优先选择与用户查询完全匹配或最接近的结果。
- **基准分数**：分数越高表示文档质量越好（最高为 100）。
- **来源信誉**：在可用时优先选择高或中信誉。
- **版本**：如果用户指定了版本（如"React 19"、"Next.js 15"），优先选择版本特定的库 ID（如 `/org/project/v1.2.0`）。

### 步骤 3：获取文档

调用 **query-docs** MCP 工具，参数为：

- **libraryId**：步骤 2 中选择的 Context7 库 ID（如 `/vercel/next.js`）。
- **query**：用户的具体问题或任务。查询越具体，获取的代码片段越相关。

限制：每个问题最多调用 query-docs（或 resolve-library-id）3 次。如果 3 次调用后答案仍不明确，说明不确定性并使用已有的最佳信息，而非猜测。

### 步骤 4：使用文档

- 使用获取的最新信息回答用户的问题。
- 在有帮助时包含文档中的相关代码示例。
- 在需要时引用库或版本（如"在 Next.js 15 中..."）。

## 示例

### 示例：Next.js middleware

1. 调用 **resolve-library-id**，参数 `libraryName: "Next.js"`，`query: "How do I set up Next.js middleware?"`。
2. 从结果中根据名称和基准分数选择最佳匹配（如 `/vercel/next.js`）。
3. 调用 **query-docs**，参数 `libraryId: "/vercel/next.js"`，`query: "How do I set up Next.js middleware?"`。
4. 使用返回的代码片段和文本回答；如相关，包含文档中的最简 `middleware.ts` 示例。

### 示例：Prisma 查询

1. 调用 **resolve-library-id**，参数 `libraryName: "Prisma"`，`query: "How do I query with relations?"`。
2. 选择官方 Prisma 库 ID（如 `/prisma/prisma`）。
3. 使用该 `libraryId` 和查询调用 **query-docs**。
4. 返回 Prisma Client 模式（如 `include` 或 `select`），附带文档中的简短代码片段。

### 示例：Supabase 认证方法

1. 调用 **resolve-library-id**，参数 `libraryName: "Supabase"`，`query: "What are the auth methods?"`。
2. 选择 Supabase 文档库 ID。
3. 调用 **query-docs**；总结认证方法并展示获取文档中的最简示例。

## 最佳实践

- **查询要具体**：尽可能将用户的完整问题作为查询，以获得更好的相关性。
- **版本感知**：当用户提到版本时，在解析步骤中使用版本特定的库 ID（如果可用）。
- **优先选择官方来源**：当存在多个匹配时，优先选择官方或主要包，而非社区分支。
- **不传输敏感数据**：在发送到 Context7 的任何查询中删除 API 密钥、密码、令牌和其他机密信息。在将用户问题传递给 resolve-library-id 或 query-docs 之前，检查其中是否可能包含机密信息。
