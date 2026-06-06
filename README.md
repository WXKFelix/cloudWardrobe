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

## 访问地址

默认 Web 端口已改为 **19006**（避免与常见工具抢占 8081）：

**http://localhost:19006**

## 常见问题

### Windows：`Port 8081 is being used` / 启动后直接回到命令行

通常是 **上次 Expo 没关干净**，端口被残留 `node.exe` 占用。

**PowerShell 按顺序执行：**

```powershell
# 1. 清理占用端口的进程
npm run kill-ports

# 2. 若仍失败，手动结束所有 node（会关掉其他 Node 项目）
taskkill /F /IM node.exe

# 3. 清缓存重新启动
npm run web:clear
```

启动成功后终端应 **一直保持运行**，并出现：

```
Waiting on http://localhost:19006
Web Bundled xxxx ms ...
```

然后浏览器打开：**http://localhost:19006**

> 如果 `Starting Metro Bundler` 后立刻回到 `PS D:\...>` 提示符，说明进程已退出，请把完整报错截图发出来，或运行：
> `npx expo start --web --port 19006 --clear` 查看红色错误信息。

### 启动很慢 / 改了代码不生效

```bash
npm run web:clear
```

### Mac / Linux：端口被占用

```bash
lsof -i :19006
npx expo start --web --port 19007
```

### 登录快速体验

- 账号：`demo`
- 密码：`demo1234`

## 脚本说明

| 命令 | 说明 |
|------|------|
| `npm run web` | 启动 Web 开发服务器（端口 19006，常驻） |
| `npm run web:clear` | 清缓存后启动（排查打包问题） |
| `npm run kill-ports` | Windows：清理 8081/19006 等占用端口 |
| `npm run start` | Expo 通用启动（可选平台） |

## 文档

见 [docs/README.md](./docs/README.md)
