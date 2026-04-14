---
name: nextjs-turbopack
description: Next.js 16+ 和 Turbopack — 增量打包、文件系统缓存、开发速度，以及何时使用 Turbopack 与 webpack。
origin: ECC
---

# Next.js 和 Turbopack

Next.js 16+ 默认在本地开发中使用 Turbopack：一个用 Rust 编写的增量打包器，显著加速开发启动和热更新。

## 何时使用

- **Turbopack（默认开发模式）**：用于日常开发。启动更快，HMR 更快，尤其在大型应用中。
- **Webpack（传统开发模式）**：仅在遇到 Turbopack 错误或在开发中依赖仅支持 webpack 的插件时使用。通过 `--webpack`（或 `--no-turbopack`，取决于你的 Next.js 版本；请查阅对应版本的文档）禁用。
- **生产环境**：生产构建（`next build`）是否使用 Turbopack 或 webpack 取决于 Next.js 版本；请查阅对应版本的官方 Next.js 文档。

使用场景：开发或调试 Next.js 16+ 应用、诊断缓慢的开发启动或 HMR、或优化生产包。

## 工作原理

- **Turbopack**：Next.js 开发环境的增量打包器。使用文件系统缓存使重启更快（如在大型项目中快 5-14 倍）。
- **默认开发模式**：从 Next.js 16 开始，`next dev` 默认使用 Turbopack 运行，除非手动禁用。
- **文件系统缓存**：重启时复用之前的工作；缓存通常位于 `.next` 目录下；基本使用无需额外配置。
- **Bundle Analyzer（Next.js 16.1+）**：实验性的 Bundle Analyzer 用于检查输出和查找大型依赖；通过配置或实验性标志启用（请查阅对应版本的 Next.js 文档）。

## 示例

### 命令

```bash
next dev
next build
next start
```

### 使用方式

运行 `next dev` 进行使用 Turbopack 的本地开发。使用 Bundle Analyzer（参见 Next.js 文档）优化代码分割和精简大型依赖。尽可能使用 App Router 和 Server Components。

## 最佳实践

- 保持使用较新的 Next.js 16.x 版本以获得稳定的 Turbopack 和缓存行为。
- 如果开发较慢，确认正在使用 Turbopack（默认）且缓存没有被不必要地清除。
- 对于生产包体积问题，使用对应版本的官方 Next.js 包分析工具。
