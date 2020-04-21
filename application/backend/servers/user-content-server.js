const express = require('express');
const path = require('path');
const { userContentServerPort, FS_ROOT } = require('../documentation/lib/consts.js');

const app = express();

app.use(express.static(FS_ROOT));

app.listen(userContentServerPort);
