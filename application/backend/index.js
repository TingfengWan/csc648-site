/*
Author: Eric Ngo, Ting Feng
Date: April 1st, 2020
*/
const express = require('express');
const httpProxy = require('http-proxy');
const { gatewayPort, staticServerPort, postServerPort, userServerPort, userContentServerPort, FS_ROOT} = require('./documentation/lib/consts.js');

const app = express();
const apiProxy = httpProxy.createProxyServer(app);

apiProxy.on('error', (err, req, res) => {
  console.log(err);
  res.status(500).send('Proxy is down');
});

app.use('*', function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
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
// if /user prefix
app.all(`${FS_ROOT}*`, (req, res) => {
  console.log('Proxying to user content server.');
  apiProxy.web(req, res, { target: `http://localhost:${userContentServerPort}` });
});

// else route to static file server
app.all('/*', (req, res) => {
  console.log('Proxying to static server.');
  apiProxy.web(req, res, { target: `http://localhost:${staticServerPort}` });
});

console.log('Listening on port: ', gatewayPort);
app.listen(gatewayPort);
