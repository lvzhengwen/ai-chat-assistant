module.exports = {
  apps: [{
    name: 'next-app',
    script: 'node_modules/next/dist/bin/next',
    args: 'start',
    cwd: '/www/wwwroot/next-app',
    env: {
      NODE_ENV: 'production',
      PORT: 3000,
      HOSTNAME: '0.0.0.0'
    },
    instances: 1,
    autorestart: true,
    watch: false,
    max_memory_restart: '1G'
  }]
} 