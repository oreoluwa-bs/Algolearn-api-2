const Enrollment = require('../models/enroll');
const Course = require('../models/course');
const factory = require('./handlerFactory');
const AppError = require('../utils/appError');

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


exports.getAllEnrollments = factory.getAll(Enrollment);

exports.getEnrollment = factory.getOne(Enrollment);

exports.createEnrollment = factory.createOne(Enrollment);

exports.updateEnrollment = factory.updateOne(Enrollment);

exports.deleteEnrollment = factory.deleteOne(Enrollment);
