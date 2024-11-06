# 构建项目
npm run build

# 设置服务器信息
$SERVER_IP = "你的服务器IP"
$SERVER_PATH = "/www/wwwroot/next-app"

# 压缩文件（需要安装 7-Zip）
7z a -ttar deploy.tar .next public package.json package-lock.json node_modules
7z a -tgzip deploy.tar.gz deploy.tar
Remove-Item deploy.tar

# 使用 scp 传输文件
scp deploy.tar.gz "root@${SERVER_IP}:${SERVER_PATH}/"

# SSH 连接并部署
ssh "root@${SERVER_IP}" "cd ${SERVER_PATH} && tar -xzf deploy.tar.gz && rm deploy.tar.gz" 