const { getDefaultConfig } = require('expo/metro-config');
const path = require('path');

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname);

// Windows 上多 worker 容易导致 Metro 在文件扫描阶段卡死
config.maxWorkers = process.platform === 'win32' ? 1 : 2;

// 缩小 watch 范围，加快启动
config.watchFolders = [__dirname];
config.resolver = {
  ...config.resolver,
  nodeModulesPaths: [path.resolve(__dirname, 'node_modules')],
};

module.exports = config;
