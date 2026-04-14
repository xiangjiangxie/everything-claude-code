#!/usr/bin/env node
/**
 * eccforopencodecn 验证脚本（中文版）
 *
 * 检查安装完整性：验证所有关键文件是否存在，配置是否正确。
 *
 * 用法:
 *   node verify.js [目标项目路径]
 */

'use strict';

const fs = require('fs');
const path = require('path');

// 必须存在的关键文件
const REQUIRED_FILES = [
  '.opencode/opencode.json',
  '.opencode/package.json',
  '.opencode/tsconfig.json',
  '.opencode/index.ts',
  '.opencode/plugins/index.ts',
  '.opencode/plugins/ecc-hooks.ts',
  '.opencode/tools/index.ts',
  '.opencode/instructions/INSTRUCTIONS.md',
  '.opencode/mcp.json',
  '.opencode/README.md',
];

// 需要检查的目录
const REQUIRED_DIRS = [
  { path: '.opencode/commands', minFiles: 20, label: 'OpenCode 命令' },
  { path: '.opencode/prompts/agents', minFiles: 10, label: '智能体提示词' },
  { path: '.opencode/tools', minFiles: 5, label: '自定义工具' },
  { path: '.opencode/ecc-agents', minFiles: 20, label: 'ECC 完整智能体' },
  { path: '.opencode/ecc-commands', minFiles: 50, label: 'ECC 完整命令' },
  { path: '.opencode/ecc-skills', minFiles: 50, label: 'ECC 完整技能库' },
  { path: '.opencode/ecc-rules', minFiles: 30, label: 'ECC 编码规则' },
  { path: '.opencode/ecc-scripts/hooks', minFiles: 20, label: '钩子核心脚本' },
  { path: '.opencode/ecc-scripts/lib', minFiles: 7, label: '工具库' },
  { path: '.opencode/ecc-contexts', minFiles: 2, label: '上下文模板' },
];

/**
 * 统计目录下文件数量（递归）
 */
function countFiles(dirPath) {
  if (!fs.existsSync(dirPath)) return 0;
  let count = 0;
  const entries = fs.readdirSync(dirPath, { withFileTypes: true });
  for (const entry of entries) {
    if (entry.isFile()) count++;
    else if (entry.isDirectory()) count += countFiles(path.join(dirPath, entry.name));
  }
  return count;
}

function verify(targetDir) {
  console.log(`\n🔍 eccforopencodecn 安装验证（中文版）`);
  console.log(`${'─'.repeat(50)}`);
  console.log(`目标目录: ${targetDir}\n`);

  let passed = 0;
  let failed = 0;

  // 关键文件检查
  console.log('📋 关键文件检查:\n');
  for (const relPath of REQUIRED_FILES) {
    const fullPath = path.join(targetDir, relPath);
    if (fs.existsSync(fullPath)) {
      console.log(`  ✅ ${relPath}`);
      passed++;
    } else {
      console.log(`  ❌ ${relPath} — 缺失`);
      failed++;
    }
  }

  // 目录检查
  console.log('\n📁 目录检查:\n');
  for (const dir of REQUIRED_DIRS) {
    const fullPath = path.join(targetDir, dir.path);
    const fileCount = countFiles(fullPath);
    if (fileCount >= dir.minFiles) {
      console.log(`  ✅ ${dir.path}/ — ${fileCount} 个文件 (${dir.label})`);
      passed++;
    } else if (fileCount > 0) {
      console.log(`  ⚠️  ${dir.path}/ — ${fileCount} 个文件，预期至少 ${dir.minFiles} (${dir.label})`);
      failed++;
    } else {
      console.log(`  ❌ ${dir.path}/ — 目录为空或不存在 (${dir.label})`);
      failed++;
    }
  }

  // opencode.json 语法检查
  console.log('\n🔗 opencode.json 配置检查:\n');
  const configPath = path.join(targetDir, '.opencode/opencode.json');
  if (fs.existsSync(configPath)) {
    try {
      const content = JSON.parse(fs.readFileSync(configPath, 'utf8'));
      const agentCount = Object.keys(content.agent || {}).length;
      const cmdCount = Object.keys(content.command || {}).length;
      const instrCount = (content.instructions || []).length;
      console.log(`  ✅ JSON 语法正确`);
      console.log(`     ${agentCount} 个智能体, ${cmdCount} 个命令, ${instrCount} 条指令`);
      passed++;
    } catch (err) {
      console.log(`  ❌ JSON 解析失败: ${err.message}`);
      failed++;
    }
  }

  // ecc-hooks.ts 检查
  console.log('\n🔌 插件检查:\n');
  const hooksPath = path.join(targetDir, '.opencode/plugins/ecc-hooks.ts');
  if (fs.existsSync(hooksPath)) {
    const content = fs.readFileSync(hooksPath, 'utf8');
    const eventCount = (content.match(/['"][\w.]+['"]\s*:/g) || []).length;
    console.log(`  ✅ ecc-hooks.ts 存在 (${Math.round(content.length / 1024)}KB)`);
    passed++;
  } else {
    console.log(`  ❌ ecc-hooks.ts 缺失`);
    failed++;
  }

  // 结果汇总
  const total = passed + failed;
  console.log(`\n${'─'.repeat(50)}`);
  if (failed === 0) {
    console.log(`✅ 全部通过! ${passed}/${total} 项检查通过`);
    console.log(`\n💡 eccforopencodecn 已正确安装（中文版）。`);
    console.log(`   下一步: cd .opencode && npm install && npx tsc\n`);
  } else {
    console.log(`⚠️  ${passed}/${total} 项通过，${failed} 项失败`);
    console.log(`\n请运行 'node install.js' 重新安装缺失的文件。\n`);
    process.exit(1);
  }
}

const targetDir = process.argv[2] ? path.resolve(process.argv[2]) : process.cwd();
if (!fs.existsSync(targetDir)) {
  console.error(`错误: 目标目录不存在: ${targetDir}`);
  process.exit(1);
}
verify(targetDir);
