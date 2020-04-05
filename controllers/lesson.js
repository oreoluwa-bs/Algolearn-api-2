/* eslint-disable consistent-return */
const Lesson = require('../models/lesson');
const Course = require('../models/course');
const AppError = require('../utils/appError');
const factory = require('./handlerFactory');

exports.setCourseUserIds = (req, res, next) => {
    if (!req.body.course) req.body.course = req.params.courseId;
    next();
};

exports.isMyCourse = async (req, res, next) => {
    const course = await Course.findById(req.body.course);
    if (course && course.author.id !== req.user.id) {
        return next(new AppError('You do not have permission to perform this action', 403));
    }

    next();
};


exports.getAllLessons = factory.getAll(Lesson);

exports.getLesson = factory.getOne(Lesson);

exports.createLesson = factory.createOne(Lesson);

exports.updateLesson = factory.updateOne(Lesson);

exports.deleteLesson = factory.deleteOne(Lesson);
