module.exports = {
  apps : [{
    name: 'instagram-post-bot',
    script: 'index.js',
    args: 'one two',
    instances: 1,
    autorestart: true,
    watch: false,
    max_memory_restart: '1G',
    env: {
      NODE_ENV: 'development'
    },
    env_production: {
      NODE_ENV: 'productionn'
    }
  }],

  deploy : {
    productionn : {
      user : 'kyllian',
      host : '172.19.3.20',
      key  : '/home/kyllian/.ssh/id_rsa',
      ref  : 'origin/master',
      repo : 'git@github.com:InstantlyMoist/instagram-post-bot.git',
      path : '/home/kyllian/instagram-post-bot',
      'post-deploy' : 'pm2 kill && git pull && npm install && pm2 start /home/kyllian/instagram-post-bot/ecosystem.config.js'
    }
  }
};
