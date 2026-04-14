#!/usr/bin/env node
/**
 * eccforcursorcn 验证脚本（中文版）
 *
 * 检查安装完整性：验证所有关键文件是否存在，钩子配置是否正确。
 *
 * 用法:
 *   node verify.js [目标项目路径]
 */

'use strict';

const fs = require('fs');
const path = require('path');

// 必须存在的关键文件列表
const REQUIRED_FILES = [
  '.cursor/hooks.json',
  '.cursor/hooks/adapter.js',
  '.cursor/hooks/session-start.js',
  '.cursor/hooks/session-end.js',
  '.cursor/hooks/before-shell-execution.js',
  '.cursor/hooks/after-shell-execution.js',
  '.cursor/hooks/after-file-edit.js',
  '.cursor/hooks/before-mcp-execution.js',
  '.cursor/hooks/after-mcp-execution.js',
  '.cursor/hooks/before-read-file.js',
  '.cursor/hooks/before-submit-prompt.js',
  '.cursor/hooks/subagent-start.js',
  '.cursor/hooks/subagent-stop.js',
  '.cursor/hooks/before-tab-file-read.js',
  '.cursor/hooks/after-tab-file-edit.js',
  '.cursor/hooks/pre-compact.js',
  '.cursor/hooks/stop.js',
  '.cursor/hooks/before-shell-execution-full.js',
  '.cursor/hooks/after-shell-execution-full.js',
  '.cursor/hooks/after-file-edit-full.js',
  '.cursor/hooks/before-file-write.js',
  '.cursor/hooks/before-mcp-execution-full.js',
  '.cursor/hooks/stop-full.js',
  '.cursor/mcp.json',
];

// 需要检查的目录（至少应含有文件）
const REQUIRED_DIRS = [
  { path: '.cursor/rules', minFiles: 5, label: '编码规则' },
  { path: '.cursor/skills', minFiles: 3, label: 'Cursor 精选技能' },
  { path: '.cursor/agents', minFiles: 20, label: '智能体' },
  { path: '.cursor/commands', minFiles: 50, label: '命令' },
  { path: '.cursor/ecc-skills', minFiles: 50, label: '完整技能库' },
  { path: '.cursor/ecc-scripts/hooks', minFiles: 20, label: '钩子核心脚本' },
  { path: '.cursor/ecc-scripts/lib', minFiles: 7, label: '工具库' },
  { path: '.cursor/contexts', minFiles: 2, label: '上下文模板' },
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
    else if (entry.isDirectory()) {
      count += countFiles(path.join(dirPath, entry.name));
    }
  }
  return count;
}

/**
 * 执行验证
 */
function verify(targetDir) {
  console.log(`\n🔍 eccforcursorcn 安装验证（中文版）`);
  console.log(`${'─'.repeat(50)}`);
  console.log(`目标目录: ${targetDir}\n`);

  let passed = 0;
  let failed = 0;

  // 检查关键文件
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

  // 检查目录
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

  // 检查 hooks.json 语法
  console.log('\n🔗 hooks.json 语法检查:\n');
  const hooksJsonPath = path.join(targetDir, '.cursor/hooks.json');
  if (fs.existsSync(hooksJsonPath)) {
    try {
      const content = JSON.parse(fs.readFileSync(hooksJsonPath, 'utf8'));
      const hookCount = Object.keys(content.hooks || {}).length;
      console.log(`  ✅ JSON 语法正确，${hookCount} 种钩子事件已配置`);
      passed++;
    } catch (err) {
      console.log(`  ❌ JSON 解析失败: ${err.message}`);
      failed++;
    }
  }

  // 结果汇总
  console.log(`\n${'─'.repeat(50)}`);
  const total = passed + failed;
  if (failed === 0) {
    console.log(`✅ 全部通过! ${passed}/${total} 项检查通过`);
    console.log(`\n💡 eccforcursorcn 已正确安装（中文版），重启 Cursor 即可使用。\n`);
  } else {
    console.log(`⚠️  ${passed}/${total} 项通过，${failed} 项失败`);
    console.log(`\n请运行 'node install.js' 重新安装缺失的文件。\n`);
    process.exit(1);
  }
}

// 主函数
const targetDir = process.argv[2]
  ? path.resolve(process.argv[2])
  : process.cwd();

if (!fs.existsSync(targetDir)) {
  console.error(`错误: 目标目录不存在: ${targetDir}`);
  process.exit(1);
}

verify(targetDir);
