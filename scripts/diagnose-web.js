#!/usr/bin/env node
/** 启动前诊断 — 在 Windows 上运行: node scripts/diagnose-web.js */
const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');
const checks = [];

function ok(msg) {
  checks.push({ ok: true, msg });
}
function fail(msg) {
  checks.push({ ok: false, msg });
}

// Node 版本
const major = parseInt(process.version.slice(1), 10);
if (major >= 18 && major <= 20) ok(`Node ${process.version}（推荐 LTS）`);
else if (major >= 18) {
  ok(`Node ${process.version}（可用，若卡顿请换 Node 20 LTS）`);
  console.warn('⚠️  提示: Node 22 在 Windows 上可能导致 Metro 长时间卡在 Starting Metro Bundler');
}
else fail(`Node ${process.version} 过低，需要 >= 18`);

// expo 存在
if (fs.existsSync(path.join(root, 'node_modules', 'expo', 'bin', 'cli'))) ok('expo CLI 已安装');
else fail('缺少 expo，请运行 npm install');

// 资源文件
for (const f of ['icon.png', 'splash.png', 'favicon.png', 'adaptive-icon.png']) {
  const p = path.join(root, 'assets', f);
  if (!fs.existsSync(p)) fail(`缺少 assets/${f}`);
  else if (fs.statSync(p).size < 100) fail(`assets/${f} 损坏（仅 ${fs.statSync(p).size} 字节）`);
  else ok(`assets/${f} 正常（${fs.statSync(p).size} bytes）`);
}

// metro 配置
if (fs.existsSync(path.join(root, 'metro.config.js'))) ok('metro.config.js 存在');
else fail('缺少 metro.config.js');

console.log('\n=== 云衣柜 Web 启动诊断 ===\n');
checks.forEach((c) => console.log(c.ok ? '✅' : '❌', c.msg));
const failed = checks.filter((c) => !c.ok);
console.log('');
if (failed.length) {
  console.log(`发现 ${failed.length} 个问题，请先修复再启动。`);
  process.exit(1);
}
console.log('诊断通过。请运行: npm run web:clear');
console.log('访问地址: http://localhost:19006\n');
