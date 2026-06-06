# 云衣柜 · cloud-wardrobe-ui

Expo 跨端 UI 原型（Web / iOS / Android）

**开发分支**：`cursor/ui-interactive-prototype-6952`

## 快速启动

```bash
git checkout cursor/ui-interactive-prototype-6952
git pull origin cursor/ui-interactive-prototype-6952
npm install
npm run web
```

## 关于 `npm run web` 一直“停在那里”

这是 **正常现象**，不是卡死。

Expo 是开发服务器，启动后会 **一直运行**，终端显示类似：

```
Starting Metro Bundler
Waiting on http://localhost:8081
Logs for your project will appear below.
```

看到这行就表示 **已经启动成功**。此时：

1. **不要关闭终端**（关了服务就停了）
2. **手动打开浏览器**访问：http://localhost:8081
3. 首次启动需等待 **30 秒～2 分钟** 完成首次打包（会显示 `Web Bundled xxx ms`）

按 `Ctrl + C` 可停止服务。

## 常见问题

### 启动很慢 / 改了代码不生效

```bash
npm run web:clear
```

### 端口 8081 被占用

```bash
# 查看占用
lsof -i :8081

# 换端口启动
npx expo start --web --port 8082
```

### 登录快速体验

- 账号：`demo`
- 密码：`demo1234`

## 脚本说明

| 命令 | 说明 |
|------|------|
| `npm run web` | 启动 Web 开发服务器（常驻） |
| `npm run web:clear` | 清缓存后启动（排查打包问题） |
| `npm run start` | Expo 通用启动（可选平台） |

## 文档

见 [docs/README.md](./docs/README.md)
