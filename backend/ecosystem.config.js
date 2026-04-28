module.exports = {
  apps: [{
    name: 'zakazhi',
    script: 'bash',
    args: '-c "cd /opt/zakazhi && export PATH=\/opt/homebrew/opt/openjdk@21/bin:/opt/homebrew/opt/python@3.12/libexec/bin:/opt/homebrew/bin:/opt/homebrew/sbin:/usr/local/bin:/System/Cryptexes/App/usr/bin:/usr/bin:/bin:/usr/sbin:/sbin:/var/run/com.apple.security.cryptexd/codex.system/bootstrap/usr/local/bin:/var/run/com.apple.security.cryptexd/codex.system/bootstrap/usr/bin:/var/run/com.apple.security.cryptexd/codex.system/bootstrap/usr/appleinternal/bin:/opt/pmk/env/global/bin:/opt/homebrew/opt/openjdk@21/bin:/opt/homebrew/opt/python@3.12/libexec/bin:/Users/kenda/.local/bin:/Users/kenda/.local/bin:/root/.local/bin && source .env.server && export DATABASE_URL JWT_SECRET && wasp start"',
    cwd: '/opt/zakazhi',
    interpreter: 'none',
    env: {
      PATH: '/root/.local/bin:/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin'
    }
  }]
};
