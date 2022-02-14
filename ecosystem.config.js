module.exports = {
  apps : [{
    name: 'simple-conference-outdial',
    script: 'app.js',
    instance_var: 'INSTANCE_ID',
    exec_mode: 'fork',
    instances: 1,
    autorestart: true,
    watch: false,
    max_memory_restart: '1G',
    env: {
      NODE_ENV: 'production',
      LOGLEVEL: 'info',
      HTTP_PORT: 3000,
      JAMBONZ_ACCOUNT_SID: '9351f46a-678c-43f5-b8a6-d4eb58d131af',
      JAMBONZ_API_KEY: '1cf2f4f4-64c4-4249-9a3e-5bb4cb597c2a',
      JAMBONZ_REST_API_BASE_URL: 'http://52.3.136.31/api',
      WEBHOOK_SECRET: 'wh_secret_cJqgtMDPzDhhnjmaJH6Mtk'
    }
  }]
};
