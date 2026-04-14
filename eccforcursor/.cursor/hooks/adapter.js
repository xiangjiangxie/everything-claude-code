#!/usr/bin/env node
/**
 * Cursor → Claude Code 钩子适配器
 *
 * 将 Cursor IDE 的 stdin JSON 格式转换为 Claude Code 钩子格式，
 * 然后委派给 scripts/hooks/*.js 中的核心实现。
 *
 * 这是 eccforcursor 钩子系统的桥梁层。
 */

const { execFileSync } = require('child_process');
const path = require('path');

// stdin 最大读取大小：1MB
const MAX_STDIN = 1024 * 1024;

/**
 * 从 stdin 读取输入数据
 * @returns {Promise<string>} 读取到的字符串
 */
function readStdin() {
  return new Promise((resolve) => {
    let data = '';
    process.stdin.setEncoding('utf8');
    process.stdin.on('data', chunk => {
      // 限制最大读取量，防止内存溢出
      if (data.length < MAX_STDIN) data += chunk.substring(0, MAX_STDIN - data.length);
    });
    process.stdin.on('end', () => resolve(data));
  });
}

/**
 * 获取插件根目录（即 eccforcursor 项目根目录）
 * adapter.js 位于 .cursor/hooks/adapter.js，向上两级即项目根
 */
function getPluginRoot() {
  return path.resolve(__dirname, '..', '..');
}

/**
 * 将 Cursor 输入格式转换为 Claude Code 钩子格式
 * @param {object} cursorInput - Cursor 传入的 JSON 对象
 * @param {object} overrides - 覆盖字段
 * @returns {object} Claude Code 格式的钩子输入
 */
function transformToClaude(cursorInput, overrides = {}) {
  return {
    tool_input: {
      command: cursorInput.command || cursorInput.args?.command || '',
      file_path: cursorInput.path || cursorInput.file || cursorInput.args?.filePath || '',
      ...overrides.tool_input,
    },
    tool_output: {
      output: cursorInput.output || cursorInput.result || '',
      ...overrides.tool_output,
    },
    transcript_path: cursorInput.transcript_path || cursorInput.transcriptPath || cursorInput.session?.transcript_path || '',
    // 保留 Cursor 特有的元数据
    _cursor: {
      conversation_id: cursorInput.conversation_id,
      hook_event_name: cursorInput.hook_event_name,
      workspace_roots: cursorInput.workspace_roots,
      model: cursorInput.model,
    },
  };
}

/**
 * 运行已有的 Claude Code 钩子脚本
 * @param {string} scriptName - 脚本文件名（如 'session-start.js'）
 * @param {string|object} stdinData - 传递给脚本的 stdin 数据
 */
function runExistingHook(scriptName, stdinData) {
  const scriptPath = path.join(getPluginRoot(), 'scripts', 'hooks', scriptName);
  try {
    execFileSync('node', [scriptPath], {
      input: typeof stdinData === 'string' ? stdinData : JSON.stringify(stdinData),
      stdio: ['pipe', 'pipe', 'pipe'],
      timeout: 15000,
      cwd: process.cwd(),
    });
  } catch (e) {
    // exit code 2 表示阻止操作，需要向上传递
    if (e.status === 2) process.exit(2);
  }
}

/**
 * 检查钩子是否启用
 *
 * 通过两个环境变量控制：
 * - ECC_HOOK_PROFILE: minimal | standard | strict（默认 standard）
 * - ECC_DISABLED_HOOKS: 逗号分隔的钩子 ID 列表
 *
 * @param {string} hookId - 钩子标识符
 * @param {string[]} allowedProfiles - 允许运行此钩子的配置级别
 * @returns {boolean} 钩子是否应该执行
 */
function hookEnabled(hookId, allowedProfiles = ['standard', 'strict']) {
  // 解析当前钩子配置级别
  const rawProfile = String(process.env.ECC_HOOK_PROFILE || 'standard').toLowerCase();
  const profile = ['minimal', 'standard', 'strict'].includes(rawProfile) ? rawProfile : 'standard';

  // 解析被禁用的钩子列表
  const disabled = new Set(
    String(process.env.ECC_DISABLED_HOOKS || '')
      .split(',')
      .map(v => v.trim().toLowerCase())
      .filter(Boolean)
  );

  // 如果此钩子在禁用列表中，返回 false
  if (disabled.has(String(hookId || '').toLowerCase())) {
    return false;
  }

  // 检查当前配置级别是否在允许列表中
  return allowedProfiles.includes(profile);
}

module.exports = { readStdin, getPluginRoot, transformToClaude, runExistingHook, hookEnabled };
