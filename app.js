const express = require('express');
// const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
// const mongoSanitze = require('express-mongo-sanitize');
// const xss = require('xss-clean');
// const hpp = require('hpp');

// Routes
const courseRouter = require('./routes/course');

const app = express();

// GLOBAL MIDDLEWARES
// Set securrity http headers
app.use(helmet());

app.use('/api/v1/course', courseRouter);

module.exports = app;
