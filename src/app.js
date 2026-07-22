const express = require('express');
const morgan = require('morgan');
const app = express();

app.use(express.json());
app.use(morgan('dev'));

//health
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'UP', uptime: process.uptime() });
});

module.exports = app;