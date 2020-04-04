/* eslint-disable no-unused-vars */
/* eslint-disable no-underscore-dangle */
/* eslint-disable consistent-return */
const { promisify } = require('util');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');

const signToken = (id) => jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
});

const createSendToken = (user, statusCode, res) => {
    const token = signToken(user._id);

    const cookieOptions = {
        expires: new Date(
            Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000,
        ),
        httpOnly: true,
    };

    if (process.env.NODE_Env === 'production') cookieOptions.secure = true;

    res.cookie('jwt', token, cookieOptions);

    // eslint-disable-next-line no-param-reassign
    user.password = undefined;

    res.status(statusCode).json({
        status: 'success',
        token,
        data: {
            user,
        },
    });
};

exports.signup = catchAsync(async (req, res, next) => {
    const newUser = await User.create(req.body);

    createSendToken(newUser, 201, res);
});

exports.login = catchAsync(async (req, res, next) => {
    const { email, password } = req.body;

    // 1) check if email and password exist

    if (!email || !password) {
        return next(new AppError('Please provide email and password!', 400));
    }

    // 2) check if user exists && password is correct
    const user = await User.findOne({ email }).select('+password');

    if (!user || !(await user.correctPassword(password, user.password))) {
        return next(new AppError('Incorrect email and password!', 401));
    }

    // 3) if everything ok, send token to client
    createSendToken(user, 200, res);
});


exports.protect = catchAsync(async (req, res, next) => {
    // 1) Get token and check if its exists
    let token;
    if (
        req.headers.authorization
        && req.headers.authorization.startsWith('Bearer')
    ) {
        // eslint-disable-next-line prefer-destructuring
        token = req.headers.authorization.split(' ')[1];
    } else if (req.qcookies.jwt) {
        token = req.cookies.jwt;
    }
    if (!token) {
        return next(new AppError('You are not logged in! Please login in to get access', 401));
    }

    // 2) Verification token
    const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

    // 3) Check if user still exists
    const currentUser = await User.findById(decoded.id);
    if (!currentUser) {
        return next(new AppError('The user belonging to the user does not exist', 401));
    }

    // 4) Check if user changed password after the token was issued
    if (currentUser.changedPasswordAfter(decoded.iat)) {
        return next(new AppError('User recently changed password! Please log in again.', 401));
    }

    // Grant access to protected route
    req.user = currentUser;
    next();
});

exports.restrictTo = (...roles) => (req, res, next) => {
    if (!roles.includes(req.user.role)) {
        return next(new AppError('You do not have permission to perform this action', 403));
    }

    next();
};

exports.updatePassword = catchAsync(async (req, res, next) => {
    // 1) Get user from collection
    const user = await User.findById(req.user.id).select('+password');

    // 2) Check if POSTed current password is correct
    if (!(await user.correctPassword(req.body.passwordCurrent, user.password))) {
        return next(new AppError('Your current password is wrong.', 401));
    }
    // 3) If so update password
    user.password = req.body.password;
    await user.save();
    // User.findByIdAndUpdate will not work as intended;


    // 4) Log the user in, send JWT
    createSendToken(user, 200, res);
});
