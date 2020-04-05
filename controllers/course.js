/* eslint-disable consistent-return */
const Course = require('../models/course');
const factory = require('./handlerFactory');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');


exports.setCourseUserIds = (req, res, next) => {
    // Allows nested routes
    if (!req.body.user) req.body.author = req.user.id;
    next();
};

exports.getAllCourses = factory.getAll(Course);

exports.getCourse = catchAsync(async (req, res, next) => {
    const doc = await Course.findOne({ slug: req.params.slug })
        .populate('reviews').populate('lessons');

    if (!doc) {
        return next(new AppError('No document found with that ID', 404));
    }

    res.status(200).json({
        status: 'success',
        data: {
            data: doc,
        },
    });
});

exports.createCourse = factory.createOne(Course);

exports.updateCourse = factory.updateOne(Course);

exports.deleteCourse = factory.deleteOne(Course);
