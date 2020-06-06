/* eslint-disable consistent-return */
const TestQuestion = require('../models/questions');
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


exports.getAllQuestions = factory.getAll(TestQuestion);

exports.getQuestion = factory.getOne(TestQuestion);

exports.createQuestion = factory.createOne(TestQuestion);

exports.updateQuestion = factory.updateOne(TestQuestion);

exports.deleteQuestion = factory.deleteOne(TestQuestion);
