const express = require('express');
const path = require('path');
const { staticServerPort } = require('../documentation/lib/consts.js');

const app = express();
app.all('/', function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    next()
  });

app.use(express.static(path.join(__dirname, '../../frontend')));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../../frontend/index/index.html'));
});

app.listen(staticServerPort);

function formatDate(date) {
  let dateObj = new Date(date);
  let month = dateObj.getMonth();
  let day = dateObj.getDay();
  let year = dateObj.getFullYear();
  let hours = dateObj.getHours();
  let minutes = dateObj.getMinutes();
  let ampm = "am";

  if(hours > 12) {
      hours = hours%12;
      ampm = "pm";
  }
  if(minutes < 10) {
    minutes += "0"
  }

  let newDate = `${month}/${day}/${year} ${hours}:${minutes}${ampm}`
  return newDate;

}