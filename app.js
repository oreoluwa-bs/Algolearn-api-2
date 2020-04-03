const express = require('express');
// const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
// const mongoSanitze = require('express-mongo-sanitize');
// const xss = require('xss-clean');
// const hpp = require('hpp');


const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/error');

// Routes
const courseRouter = require('./routes/course');

const app = express();

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    // eslint-disable-next-line max-len
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
});


// GLOBAL MIDDLEWARES
// Set securrity http headers
app.use(helmet());

// Body Parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/v1/course', courseRouter);

app.all('*', (req, res, next) => {
    next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

app.use(globalErrorHandler);

module.exports = app;
