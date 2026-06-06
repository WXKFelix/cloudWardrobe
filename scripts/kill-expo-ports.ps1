# 清理 Expo / Metro 占用的常见端口（Windows PowerShell）
# 用法：powershell -ExecutionPolicy Bypass -File scripts/kill-expo-ports.ps1

$ports = 8081, 8082, 8083, 19000, 19001, 19006

Write-Host "正在清理端口: $($ports -join ', ')" -ForegroundColor Yellow

foreach ($port in $ports) {
  $connections = Get-NetTCPConnection -LocalPort $port -ErrorAction SilentlyContinue
  foreach ($conn in $connections) {
    $pid = $conn.OwningProcess
    if ($pid -and $pid -ne 0) {
      Write-Host "  终止端口 $port 上的进程 PID=$pid"
      Stop-Process -Id $pid -Force -ErrorAction SilentlyContinue
    }
  }
}

# 可选：结束所有 node 进程（若仍无法启动，取消下面注释）
# Write-Host "结束所有 node.exe ..." -ForegroundColor Yellow
# Get-Process node -ErrorAction SilentlyContinue | Stop-Process -Force

Write-Host "完成。请重新运行: npm run web" -ForegroundColor Green
