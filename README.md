# 云衣柜 · cloudWardrobe

Expo 跨端 UI 原型（Web / iOS / Android）

**开发分支**：`cursor/ui-interactive-prototype-6952`

## 快速启动

```bash
git checkout cursor/ui-interactive-prototype-6952
git pull origin cursor/ui-interactive-prototype-6952
npm install
npm run web:diagnose   # 先诊断
npm run web:clear      # 再启动
```

**访问地址：http://localhost:19006**

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

**http://localhost:19006**

---

## ⚠️ Node 版本要求（必读）

| 你的版本 | 结果 |
|----------|------|
| **v20.x LTS** | ✅ 推荐，完美运行 |
| v18 / v22 | ⚠️ 可用，建议换 20 |
| **v23 / v24** | ❌ **Expo 不支持，Metro 会卡在 Starting Metro Bundler** |

### Windows：没有 nvm？直接安装 Node 20（推荐）

你看到的 `nvm : The term 'nvm' is not recognized` 说明 **本机未安装 nvm**，不必装 nvm，按下面做即可：

1. **卸载 Node 24**（若已安装）  
   `设置` → `应用` → 搜索 **Node.js** → 卸载

2. **下载 Node 20 LTS 安装包**  
   https://nodejs.org/en/download/prebuilt-installer  
   - Version: **20.x LTS**  
   - Platform: **Windows**  
   - 下载 `.msi` 并一路下一步安装

3. **关闭所有 PowerShell / 终端窗口，重新打开一个新窗口**

4. **确认版本**（必须是 v20，不能仍是 v24.14.0）：

```powershell
node -v
# 应显示 v20.x.x
```

5. **回到项目重装依赖并启动**：

```powershell
cd D:\Code\cloudWardrobe
taskkill /F /IM node.exe 2>$null
Remove-Item -Recurse -Force node_modules, .expo -ErrorAction SilentlyContinue
Remove-Item package-lock.json -ErrorAction SilentlyContinue
npm install
npm run web:clear
```

浏览器打开：**http://localhost:19006**

### 可选：以后想管理多个 Node 版本再用 nvm-windows

仅当你需要同时保留 Node 20 和 24 时才装：

- 下载：https://github.com/coreybutler/nvm-windows/releases  
- 安装后（管理员 PowerShell）：`nvm install 20` → `nvm use 20`

## 常见问题

### Windows：一直卡在 `Starting Metro Bundler`（最常见）

按顺序 **完整执行**（不要跳步）：

```powershell
# 0. 【必做】检查 Node 版本 — v24/v23 会导致 Metro 永久卡死！
node -v
# 必须是 v18 / v20 / v22，推荐 v20 LTS
# 你当前若是 v24.x，请按下方「切换 Node 版本」操作

# 1. 拉最新代码
cd D:\Code\cloudWardrobe
git pull origin cursor/ui-interactive-prototype-6952

# 2. 彻底清理
taskkill /F /IM node.exe
Remove-Item -Recurse -Force node_modules, .expo -ErrorAction SilentlyContinue

# 3. 重新安装
npm install

# 4. 诊断（必须全部 ✅）
npm run web:diagnose

# 5. 清缓存启动（耐心等待 1~3 分钟）
npm run web:clear
```

**成功标志**（按顺序出现）：

```
Starting Metro Bundler
Waiting on http://localhost:19006    ← 出现这行说明已启动
Web Bundled xxxx ms ...                ← 出现这行说明可以打开浏览器
```

浏览器访问：**http://localhost:19006**

---

### 备用方案：不用 Metro 开发服务器（若上面仍卡住）

直接打包成静态网页预览（更稳定）：

```powershell
npm run web:preview
```

然后打开 **http://localhost:19006**（每次改代码需重新运行）

---

### 一直加载、不出现访问地址

**常见原因：`assets/` 图片损坏**（仅 8 字节的假 PNG 会导致 Metro 卡住）。

拉取最新代码后 assets 应 > 500 字节。

---

### Windows：端口被占用 / 启动后直接回到命令行

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
| `npm run web:diagnose` | 启动前诊断（Node/资源/配置） |
| `npm run web` | 启动 Web 开发服务器（端口 19006） |
| `npm run web:clear` | 清缓存后启动（排查卡死首选） |
| `npm run web:preview` | 静态打包预览（Metro 卡死时的备用方案） |
| `npm run kill-ports` | Windows：清理占用端口 |
| `npm run start` | Expo 通用启动（可选平台） |

## 文档

见 [docs/README.md](./docs/README.md)
