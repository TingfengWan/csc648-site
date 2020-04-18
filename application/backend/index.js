const express = require('express');
const httpProxy = require('http-proxy');
const { gatewayPort, staticServerPort, postServerPort, userServerPort} = require('./documentation/lib/consts.js');

const app = express();
const apiProxy = httpProxy.createProxyServer(app);

apiProxy.on('error', (err, req, res) => {
  console.log(err);
  res.status(500).send('Proxy is down');
});

app.all('/', function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    next()
  });
// if /post prefix
app.all('/post*', (req, res) => {
  console.log('Proxying to post server.');
  apiProxy.web(req, res, { target: `http://localhost:${postServerPort}` });
});

// if /user prefix
app.all('/user*', (req, res) => {
  console.log('Proxying to user server.');
  apiProxy.web(req, res, { target: `http://localhost:${userServerPort}` });
});

// else route to static file server
app.all('/*', (req, res) => {
  console.log('Proxying to static server.');
  apiProxy.web(req, res, { target: `http://localhost:${staticServerPort}` });
});

console.log('Listening on port: ', gatewayPort);
app.listen(gatewayPort);
