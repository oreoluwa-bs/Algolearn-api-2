const express = require('express');
// const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
// const mongoSanitze = require('express-mongo-sanitize');
// const xss = require('xss-clean');
// const hpp = require('hpp');

const app = express();

// GLOBAL MIDDLEWARES
// Set securrity http headers
app.use(helmet());

module.exports = app;
