const express = require('express');
const httpProxy = require('http-proxy');
const { gatewayPort, staticServerPort, postServerPort} = require('./documentation/lib/consts.js');

const app = express();
const apiProxy = httpProxy.createProxyServer(app);

apiProxy.on('error', (err, req, res) => {
  console.log(err);
  res.status(500).send('Proxy is down');
});

// if /post prefix
app.all('/post*', (req, res) => {
  console.log('Proxying to post server.');
  apiProxy.web(req, res, { target: `http://localhost:${postServerPort}` });
});

// else route to static file server
app.all('/*', (req, res) => {
  console.log('Proxyign to static server.');
  apiProxy.web(req, res, { target: `http://localhost:${staticServerPort}` });
});

console.log('Listening on port: ', gatewayPort);
app.listen(gatewayPort);