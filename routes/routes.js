const express = require('express');
const app = express();

app.use(require('./encuesta'));

module.exports = app;