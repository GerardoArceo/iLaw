//REQUIREDS
const express = require('express');

const app = express();

app.use(require('./api'));
app.use(require('./get_laws'));

module.exports = app;