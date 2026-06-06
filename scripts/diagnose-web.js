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

// Node 版本 — Expo SDK 52 官方支持 18~22，Node 24 会导致 Metro 卡死
const major = parseInt(process.version.slice(1).split('.')[0], 10);
if (major === 20) ok(`Node ${process.version}（推荐，完美兼容）`);
else if (major === 18 || major === 22)
  ok(`Node ${process.version}（可用，推荐换 20 LTS 更稳）`);
else if (major >= 23)
  fail(
    `Node ${process.version} 过新！Expo 52 不支持 Node 24+，Metro 会卡在 Starting Metro Bundler。请降级到 Node 20 LTS`
  );
else if (major >= 18) ok(`Node ${process.version}`);
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
