module.exports = { // pm2 start process.config.js
    apps: [
        {
            name: 'index',
            script: './index.js',
            ignore_watch : ["node_modules"],
            watch: true,
        },
        {
            name: 'post',
            script: './servers/post-server.js',
            ignore_watch : ["node_modules"],
            watch: true,
        },
        {
            name: 'static',
            script: './servers/static-server.js',
            ignore_watch : ["node_modules"],
            watch: true,
        }
    ]
};
  