const express = require('express');
const httpProxy = require('http-proxy');
const { gatewayPort, staticServerPort, postServerPort} = require('../documentation/lib/consts.js');

const app = express();
const apiProxy = httpProxy.createProxyServer(app);

apiProxy.on('error', (err, req, res) => {
  console.log(err);
  res.status(500).send('Proxy is down');
});

// if /post prefix
app.all('/post*', (req, res) => {
  apiProxy.web(req, res, { target: postServerPort });
});

// else route to static file server
app.all('/*', (req, res) => {
  apiProxy.web(req, res, { target: staticServerPort });
});

app.listen(gatewayPort);