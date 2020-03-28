module.exports = { // pm2 start process.config.js
    apps: [
        {
            name: 'index',
            script: './gateway.js',
            ignore_watch : ["node_modules"],
            watch: true,
        },
        {
            name: 'post',
            script: './server/post-server.js',
            ignore_watch : ["node_modules"],
            watch: true,
        },
        {
            name: 'static',
            script: './server/static-server.js',
            ignore_watch : ["node_modules"],
            watch: true,
        }
    ]
};
  