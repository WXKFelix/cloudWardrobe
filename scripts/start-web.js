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
  console.log('');
  console.log('  ⚠️  警告: Node 24+ 不受 Expo 支持，Metro 极易卡死！');
  console.log('  请安装 Node 20 LTS: https://nodejs.org/en/download');
  console.log('  或使用 nvm-windows: nvm install 20 && nvm use 20');
  console.log('');
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
  // Windows: 减少 Metro 文件扫描范围，避免卡死
  ...(process.platform === 'win32'
    ? {
        EXPO_USE_METRO_WORKSPACE_ROOT: '1',
        CI: 'false',
      }
    : {}),
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
