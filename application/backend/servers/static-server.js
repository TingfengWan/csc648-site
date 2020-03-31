const express = require('express');
const path = require('path');
const { staticServerPort } = require('../documentation/lib/consts.js');

const app = express();

app.use(express.static(path.join(__dirname, '../../frontend')));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/index/index.html'));
});

app.listen(staticServerPort);
