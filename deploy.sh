#!/bin/bash

# 构建项目
echo "开始构建项目..."
npm run build

# 检查构建是否成功
if [ ! -d ".next" ]; then
    echo "错误：.next 目录不存在，构建可能失败"
    exit 1
fi

# 服务器信息
SERVER_IP="106.54.0.73"
SERVER_PATH="/www/wwwroot/next-app"

# 压缩必要文件
echo "开始压缩文件..."
tar -czvf deploy.tar.gz .next public package.json package-lock.json node_modules
if [ ! -f "deploy.tar.gz" ]; then
    echo "错误：压缩文件创建失败"
    exit 1
fi

# 检查压缩文件大小
echo "压缩文件大小："
ls -lh deploy.tar.gz

# 将文件传输到服务器
echo "开始上传文件到服务器..."
scp -v deploy.tar.gz root@${SERVER_IP}:${SERVER_PATH}/

# SSH登录到服务器并部署
echo "开始在服务器上解压文件..."
ssh root@${SERVER_IP} << 'ENDSSH'
cd /www/wwwroot/next-app/
ls -la deploy.tar.gz
tar -xzvf deploy.tar.gz
rm deploy.tar.gz
chown -R www:www .
chmod -R 755 .

# 安装 PM2（如果还没安装）
if ! command -v pm2 &> /dev/null; then
    npm install -g pm2
fi

# 创建 PM2 配置文件
cat > ecosystem.config.js << 'EOF'
module.exports = {
  apps: [{
    name: 'next-app',
    script: 'node_modules/next/dist/bin/next',
    args: 'start',
    cwd: '/www/wwwroot/next-app',
    env: {
      NODE_ENV: 'production',
      PORT: 3000
    },
    instances: 1,
    autorestart: true,
    watch: false,
    max_memory_restart: '1G'
  }]
}
EOF

# 使用 PM2 重启应用
pm2 delete next-app 2>/dev/null || true
pm2 start ecosystem.config.js
pm2 save

echo "项目已重启"
ENDSSH

# 清理本地压缩文件
rm deploy.tar.gz

echo "部署完成！"
