#!/usr/bin/env node
/**
 * eccforcursor 安装脚本
 *
 * 将 eccforcursor 的内容（钩子、规则、技能、智能体）复制到目标项目的 .cursor/ 目录中。
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

// 源目录：eccforcursor 项目根目录
const SOURCE_ROOT = __dirname;

// 需要复制的目录及其在目标项目中的映射关系
// 所有内容均已整合到 .cursor/ 下，一次复制即可获得完整功能
const COPY_MAP = [
  // 整个 .cursor/ 目录（自包含，包含全部功能）
  { src: '.cursor/hooks.json', dest: '.cursor/hooks.json', type: 'file' },
  { src: '.cursor/mcp.json', dest: '.cursor/mcp.json', type: 'file' },
  { src: '.cursor/hooks', dest: '.cursor/hooks', type: 'dir' },
  { src: '.cursor/rules', dest: '.cursor/rules', type: 'dir' },
  { src: '.cursor/skills', dest: '.cursor/skills', type: 'dir' },
  { src: '.cursor/agents', dest: '.cursor/agents', type: 'dir' },
  { src: '.cursor/commands', dest: '.cursor/commands', type: 'dir' },
  { src: '.cursor/ecc-skills', dest: '.cursor/ecc-skills', type: 'dir' },
  { src: '.cursor/ecc-scripts', dest: '.cursor/ecc-scripts', type: 'dir' },
  { src: '.cursor/contexts', dest: '.cursor/contexts', type: 'dir' },
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
 * 确保目录存在，不存在则递归创建
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
  const options = {
    help: false,
    dryRun: false,
    targetDir: null,
  };

  for (const arg of args) {
    if (arg === '--help' || arg === '-h') {
      options.help = true;
    } else if (arg === '--dry-run') {
      options.dryRun = true;
    } else if (!arg.startsWith('-')) {
      options.targetDir = arg;
    }
  }

  return options;
}

/**
 * 显示帮助信息
 */
function showHelp() {
  console.log(`
eccforcursor 安装工具

用法:
  node install.js [选项] [目标项目路径]

选项:
  --dry-run    仅显示将要执行的操作，不实际复制文件
  --help, -h   显示此帮助信息

说明:
  将 eccforcursor/.cursor/ 目录复制到目标项目中（自包含，无外部依赖），包括：
  - 钩子配置和脚本（16 种自动化钩子，含增强版功能）
  - 编码规则（39 条，覆盖 6 种编程语言）
  - AI 技能定义（135 个技能 + .cursor/ 中的 10 个精选技能）
  - 智能体定义（30 个智能体）
  - 命令（60 个斜杠命令）
  - MCP 服务器配置（GitHub、Context7、Exa 等）
  - 上下文文件（开发、研究、审查）
  - 运行时依赖脚本（钩子核心 + 工具库 + CLI）

  如果不指定目标路径，默认安装到当前目录。

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
  const targetCursorDir = path.join(targetDir, '.cursor');
  let totalFiles = 0;
  const operations = [];

  console.log(`\n📦 eccforcursor 安装器`);
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
      const destPath = path.join(targetDir, mapping.dest);
      operations.push({ src: srcPath, dest: destPath });
      totalFiles++;
    } else {
      const files = listFilesRecursive(srcPath);
      for (const relFile of files) {
        const fileSrc = path.join(srcPath, relFile);
        const fileDest = path.join(targetDir, mapping.dest, relFile);
        operations.push({ src: fileSrc, dest: fileDest });
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
  for (const [dir, files] of Object.entries(groups).sort()) {
    console.log(`  📁 ${dir}/`);
    for (const file of files.sort()) {
      console.log(`     ${dryRun ? '(将复制)' : '✓'} ${file}`);
    }
  }

  if (dryRun) {
    console.log(`\n📋 预览完成: 共 ${totalFiles} 个文件将被安装`);
    console.log('运行不带 --dry-run 来执行安装\n');
    return;
  }

  // 执行复制
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
  console.log(`   1. 重启 Cursor 以加载新的钩子和规则`);
  console.log(`   2. 通过环境变量 ECC_HOOK_PROFILE 控制钩子级别:`);
  console.log(`      minimal  — 仅基本会话管理`);
  console.log(`      standard — 默认，包含格式化和安全检查`);
  console.log(`      strict   — 全部钩子启用（含提交质量、tmux提醒等）`);
  console.log(`   3. 通过 ECC_DISABLED_HOOKS 禁用特定钩子`);
  console.log(`   4. MCP 配置已安装到 .cursor/mcp.json`);
  console.log(`   5. 全部 30 个智能体、135 个技能、60 个命令已就绪\n`);
}

/**
 * 主函数
 */
function main() {
  const options = parseArgs(process.argv);

  if (options.help) {
    showHelp();
    process.exit(0);
  }

  const targetDir = options.targetDir
    ? path.resolve(options.targetDir)
    : process.cwd();

  if (!fs.existsSync(targetDir)) {
    console.error(`错误: 目标目录不存在: ${targetDir}`);
    process.exit(1);
  }

  install(targetDir, options.dryRun);
}

main();
