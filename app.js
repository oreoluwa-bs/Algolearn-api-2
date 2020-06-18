const express = require('express');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitze = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');
const cors = require('cors');
const path = require('path');


const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/error');

// Routes
const courseRouter = require('./routes/course');
const userRouter = require('./routes/user');
const reviewRouter = require('./routes/review');
// const enrollRouter = require('./routes/enroll');
const lessonRouter = require('./routes/lesson');
const reportRouter = require('./routes/reportedCourse');

const app = express();

// GLOBAL MIDDLEWARES
// Serving Static Files
app.use(express.static(path.join(__dirname, 'public')));

// Set securrity http headers
app.use(helmet());
app.use(cors());

// Limit the amount of requests sent from a specific IP
const limiter = rateLimit({
    max: 300,
    windowMs: 60 * 60 * 1000,
    message: 'Too many requests from this IP, please try again in an hour!',
});

app.use('/api', limiter);

// Body Parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Data sanitization against NoSQL query Injection
app.use(mongoSanitze());

// Data sanitization agains xss
app.use(xss());

// Prevent parameter pollution
app.use(hpp({
    whitelist: [
        'duration',
        'ratingsAverage',
        'ratingsQuatity',
        'maxGroupSize',
        'difficulty',
        'price',
    ],
}));


// ROUTES
app.use('/api/v1/courses', courseRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/reviews', reviewRouter);
app.use('/api/v1/lessons', lessonRouter);
app.use('/api/v1/reports', reportRouter);

app.all('*', (req, res, next) => {
    next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

app.use(globalErrorHandler);

module.exports = app;
