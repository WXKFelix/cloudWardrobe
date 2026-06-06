#!/usr/bin/env node
const { spawn } = require('child_process');
const path = require('path');

const PORT = process.env.EXPO_WEB_PORT || '19006';
const args = ['start', '--web', '--port', PORT, ...process.argv.slice(2)];

console.log('');
console.log('========================================');
console.log('  云衣柜 Cloud Wardrobe - Web 开发服务器');
console.log('========================================');
console.log('');
console.log(`  启动后请在浏览器打开：`);
console.log(`  >>> http://localhost:${PORT} <<<`);
console.log('');
console.log('  首次启动需等待 30~90 秒出现 Web Bundled');
console.log('  按 Ctrl+C 停止服务');
console.log('');
console.log('========================================');
console.log('');

const child = spawn(
  process.platform === 'win32' ? 'npx.cmd' : 'npx',
  ['expo', ...args],
  { stdio: 'inherit', shell: true, cwd: path.join(__dirname, '..') }
);

child.on('exit', (code) => process.exit(code ?? 0));
