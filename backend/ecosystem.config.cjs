module.exports = {
  apps: [{
    name: 'zakazhi',
    script: '/opt/zakazhi/start.sh',
    cwd: '/opt/zakazhi',
    interpreter: 'bash',
    env: {
      PATH: '/root/.local/bin:/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin'
    }
  }]
};
