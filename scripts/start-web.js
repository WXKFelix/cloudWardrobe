#!/usr/bin/env node
/**
 * 跨平台 Web 启动脚本（避免 Windows 上 npx.cmd + shell 卡死）
 */
const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

const projectRoot = path.join(__dirname, '..');
const PORT = process.env.EXPO_WEB_PORT || '19006';
const extraArgs = process.argv.slice(2);
const expoCli = path.join(projectRoot, 'node_modules', 'expo', 'bin', 'cli');

if (!fs.existsSync(expoCli)) {
  console.error('❌ 未找到 expo，请先运行: npm install');
  process.exit(1);
}

console.log('');
console.log('========================================');
console.log('  云衣柜 Cloud Wardrobe - Web 开发服务器');
console.log('========================================');
console.log('');
const nodeMajor = parseInt(process.version.slice(1).split('.')[0], 10);
console.log(`  Node 版本: ${process.version}`);
if (nodeMajor >= 23) {
  console.error('');
  console.error(`  ❌ Node ${process.version} 不受 Expo SDK 52 支持（需 18–22）`);
  console.error('  Metro 会卡在 "Starting Metro Bundler"，无法打开网页。');
  console.error('');
  console.error('  修复（推荐：不用 nvm，直接装 Node 20 LTS）：');
  console.error('    1. 打开 https://nodejs.org/en/download/prebuilt-installer');
  console.error('       选 Version=20.x LTS, Platform=Windows, 下载 .msi 安装');
  console.error('    2. 若已装 Node 24，先在「设置 → 应用」卸载 Node.js');
  console.error('    3. 安装 Node 20 后，关闭并重新打开 PowerShell');
  console.error('    4. node -v          # 应显示 v20.x，不是 v24.14.0');
  console.error('    5. rmdir /s /q node_modules && del package-lock.json');
  console.error('    6. npm install && npm run web:clear');
  console.error('');
  console.error('  可选：安装 nvm-windows 管理多版本');
  console.error('    https://github.com/coreybutler/nvm-windows/releases');
  console.error('');
  process.exit(1);
}
console.log(`  项目路径: ${projectRoot}`);
console.log('');
console.log('  启动后请在浏览器打开：');
console.log(`  >>> http://localhost:${PORT} <<<`);
console.log('');
console.log('  正常流程: Starting Metro → Waiting on → Web Bundled');
console.log('  Windows 首次启动可能需要 1~3 分钟，请耐心等待');
console.log('  按 Ctrl+C 停止');
console.log('');
console.log('========================================');
console.log('');

const expoArgs = [
  expoCli,
  'start',
  '--web',
  '--port',
  PORT,
  '--max-workers',
  '1',
  ...extraArgs,
];

const env = {
  ...process.env,
  REACT_NATIVE_PACKAGER_HOSTNAME: '127.0.0.1',
  EXPO_NO_TELEMETRY: '1',
  // Windows: 避免 CI 模式限制交互；workspace root 已由 Expo 默认开启，勿再设 EXPO_USE_METRO_WORKSPACE_ROOT
  ...(process.platform === 'win32' ? { CI: 'false' } : {}),
};

const child = spawn(process.execPath, expoArgs, {
  stdio: 'inherit',
  cwd: projectRoot,
  env,
  windowsHide: true,
});

child.on('error', (err) => {
  console.error('❌ 启动失败:', err.message);
  process.exit(1);
});

child.on('exit', (code, signal) => {
  if (signal) {
    console.log(`进程被信号终止: ${signal}`);
    process.exit(1);
  }
  process.exit(code ?? 0);
});
