#!/usr/bin/env node
/**
 * eccforopencode 安装脚本
 *
 * 将 eccforopencode 的内容（配置、插件、钩子、规则、技能、智能体、命令）
 * 复制到目标项目的 .opencode/ 目录中。
 *
 * 用法:
 *   node install.js [目标项目路径]
 *   node install.js --dry-run [目标项目路径]
 *   node install.js --help
 *
 * 如果不提供目标路径，默认使用当前工作目录。
 */

'use strict';

const fs = require('fs');
const path = require('path');

// 源目录：eccforopencode 项目根目录
const SOURCE_ROOT = __dirname;

// 所有内容均在 .opencode/ 内，自包含复制
const COPY_MAP = [
  // OpenCode 核心配置
  { src: '.opencode/opencode.json', dest: '.opencode/opencode.json', type: 'file' },
  { src: '.opencode/package.json', dest: '.opencode/package.json', type: 'file' },
  { src: '.opencode/package-lock.json', dest: '.opencode/package-lock.json', type: 'file' },
  { src: '.opencode/tsconfig.json', dest: '.opencode/tsconfig.json', type: 'file' },
  { src: '.opencode/index.ts', dest: '.opencode/index.ts', type: 'file' },
  { src: '.opencode/README.md', dest: '.opencode/README.md', type: 'file' },
  { src: '.opencode/MIGRATION.md', dest: '.opencode/MIGRATION.md', type: 'file' },
  { src: '.opencode/mcp.json', dest: '.opencode/mcp.json', type: 'file' },
  // TypeScript 插件（钩子系统）
  { src: '.opencode/plugins', dest: '.opencode/plugins', type: 'dir' },
  // 自定义工具
  { src: '.opencode/tools', dest: '.opencode/tools', type: 'dir' },
  // 指令/规则
  { src: '.opencode/instructions', dest: '.opencode/instructions', type: 'dir' },
  // OpenCode 原生命令
  { src: '.opencode/commands', dest: '.opencode/commands', type: 'dir' },
  // 智能体提示词
  { src: '.opencode/prompts', dest: '.opencode/prompts', type: 'dir' },
  // ECC 完整内容（自包含）
  { src: '.opencode/ecc-agents', dest: '.opencode/ecc-agents', type: 'dir' },
  { src: '.opencode/ecc-commands', dest: '.opencode/ecc-commands', type: 'dir' },
  { src: '.opencode/ecc-skills', dest: '.opencode/ecc-skills', type: 'dir' },
  { src: '.opencode/ecc-scripts', dest: '.opencode/ecc-scripts', type: 'dir' },
  { src: '.opencode/ecc-rules', dest: '.opencode/ecc-rules', type: 'dir' },
  { src: '.opencode/ecc-contexts', dest: '.opencode/ecc-contexts', type: 'dir' },
];

/**
 * 递归列出目录下所有文件的相对路径
 */
function listFilesRecursive(dirPath, basePath) {
  basePath = basePath || dirPath;
  const results = [];
  if (!fs.existsSync(dirPath)) return results;
  const entries = fs.readdirSync(dirPath, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dirPath, entry.name);
    if (entry.isDirectory()) {
      results.push(...listFilesRecursive(fullPath, basePath));
    } else if (entry.isFile()) {
      results.push(path.relative(basePath, fullPath));
    }
  }
  return results;
}

/**
 * 确保目录存在
 */
function ensureDir(dirPath) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
}

/**
 * 复制单个文件
 */
function copyFile(src, dest) {
  ensureDir(path.dirname(dest));
  fs.copyFileSync(src, dest);
}

/**
 * 解析命令行参数
 */
function parseArgs(argv) {
  const args = argv.slice(2);
  const options = { help: false, dryRun: false, targetDir: null };
  for (const arg of args) {
    if (arg === '--help' || arg === '-h') options.help = true;
    else if (arg === '--dry-run') options.dryRun = true;
    else if (!arg.startsWith('-')) options.targetDir = arg;
  }
  return options;
}

/**
 * 显示帮助信息
 */
function showHelp() {
  console.log(`
eccforopencode 安装工具

用法:
  node install.js [选项] [目标项目路径]

选项:
  --dry-run    仅显示将要执行的操作，不实际复制文件
  --help, -h   显示此帮助信息

说明:
  将 eccforopencode/.opencode/ 目录复制到目标项目中（自包含），包括：
  - OpenCode 核心配置（opencode.json、TypeScript 插件系统）
  - 钩子插件（ecc-hooks.ts，基于 @opencode-ai/plugin API）
  - 自定义工具（代码格式化、测试、lint、安全审计、git 摘要、覆盖率）
  - 智能体定义（13 个 OpenCode 原生 + 30 个 ECC 完整版）
  - 命令（34 个 OpenCode 原生 + 60 个 ECC 完整版）
  - 技能（135 个完整技能库）
  - 编码规则（77 条，按语言分类）
  - MCP 服务器配置、上下文模板

  .opencode/ 目录完全自包含，也可直接复制:
  cp -r eccforopencode/.opencode/ /your/project/.opencode/

示例:
  node install.js                     # 安装到当前项目
  node install.js /path/to/project    # 安装到指定项目
  node install.js --dry-run           # 预览安装计划
`);
}

/**
 * 执行安装
 */
function install(targetDir, dryRun) {
  let totalFiles = 0;
  const operations = [];

  console.log(`\n📦 eccforopencode 安装器`);
  console.log(`${'─'.repeat(50)}`);
  console.log(`源目录: ${SOURCE_ROOT}`);
  console.log(`目标目录: ${targetDir}`);
  console.log(`模式: ${dryRun ? '预览（dry-run）' : '正式安装'}`);
  console.log(`${'─'.repeat(50)}\n`);

  for (const mapping of COPY_MAP) {
    const srcPath = path.join(SOURCE_ROOT, mapping.src);
    if (!fs.existsSync(srcPath)) {
      console.log(`⚠ 跳过 ${mapping.src}（源不存在）`);
      continue;
    }
    if (mapping.type === 'file') {
      operations.push({ src: srcPath, dest: path.join(targetDir, mapping.dest) });
      totalFiles++;
    } else {
      const files = listFilesRecursive(srcPath);
      for (const relFile of files) {
        operations.push({
          src: path.join(srcPath, relFile),
          dest: path.join(targetDir, mapping.dest, relFile),
        });
        totalFiles++;
      }
    }
  }

  // 按目标路径分组显示
  const groups = {};
  for (const op of operations) {
    const relDest = path.relative(targetDir, op.dest);
    const dir = path.dirname(relDest);
    if (!groups[dir]) groups[dir] = [];
    groups[dir].push(path.basename(relDest));
  }

  console.log('文件操作计划:\n');
  const sortedDirs = Object.keys(groups).sort();
  const displayLimit = 30;
  let displayed = 0;
  for (const dir of sortedDirs) {
    if (displayed >= displayLimit) {
      console.log(`  ... 以及 ${sortedDirs.length - displayLimit} 个更多目录`);
      break;
    }
    const files = groups[dir].sort();
    console.log(`  📁 ${dir}/ (${files.length} 个文件)`);
    displayed++;
  }

  if (dryRun) {
    console.log(`\n📋 预览完成: 共 ${totalFiles} 个文件将被安装`);
    console.log('运行不带 --dry-run 来执行安装\n');
    return;
  }

  let copied = 0;
  let skipped = 0;
  for (const op of operations) {
    try {
      copyFile(op.src, op.dest);
      copied++;
    } catch (err) {
      console.error(`  ✗ 复制失败: ${path.relative(targetDir, op.dest)} — ${err.message}`);
      skipped++;
    }
  }

  console.log(`\n${'─'.repeat(50)}`);
  console.log(`✅ 安装完成!`);
  console.log(`   已复制: ${copied} 个文件`);
  if (skipped > 0) console.log(`   跳过: ${skipped} 个文件`);
  console.log(`\n💡 提示:`);
  console.log(`   1. 安装 OpenCode 插件依赖: cd .opencode && npm install`);
  console.log(`   2. 编译 TypeScript 插件: cd .opencode && npx tsc`);
  console.log(`   3. 通过环境变量 ECC_HOOK_PROFILE 控制钩子级别:`);
  console.log(`      minimal | standard（默认）| strict`);
  console.log(`   4. opencode.json 已配置 13 个智能体和 26 个命令`);
  console.log(`   5. 完整 ECC 资源库包含 30 个智能体、135 个技能、60 个命令\n`);
}

function main() {
  const options = parseArgs(process.argv);
  if (options.help) { showHelp(); process.exit(0); }
  const targetDir = options.targetDir ? path.resolve(options.targetDir) : process.cwd();
  if (!fs.existsSync(targetDir)) {
    console.error(`错误: 目标目录不存在: ${targetDir}`);
    process.exit(1);
  }
  install(targetDir, options.dryRun);
}

main();
