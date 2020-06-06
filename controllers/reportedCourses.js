const ReportedCourse = require('../models/reportedCourses');
const Course = require('../models/course');
const AppError = require('../utils/appError');
const factory = require('./handlerFactory');

exports.setCourseUserIds = (req, res, next) => {
    // Allows nested routes
    if (!req.body.course) req.body.course = req.params.courseId;
    if (!req.body.user) req.body.user = req.user.id;
    next();
};

// eslint-disable-next-line consistent-return
exports.isMyCourse = async (req, res, next) => {
    const course = await Course.findById(req.body.course);
    if (course && course.author.id === req.user.id) {
        return next(new AppError('You do not have permission to perform this action', 403));
    }

    next();
};


exports.getAllReportedCourses = factory.getAll(ReportedCourse);

exports.getReportedCourse = factory.getOne(ReportedCourse);

exports.createReportedCourse = factory.createOne(ReportedCourse);

exports.updateReportedCourse = factory.updateOne(ReportedCourse);

exports.deleteReportedCourse = factory.deleteOne(ReportedCourse);
