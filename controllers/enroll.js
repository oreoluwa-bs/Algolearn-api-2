const mongoose = require('mongoose');
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

exports.getMonthlyEnrolledStats = async (req, res) => {
    try {
        const year = req.params.year * 1;
        // const year = 2020;
        const course = req.body.course ? mongoose.Types.ObjectId(req.body.course) : null;
        const plan = await Enrollment.aggregate([
            {
                $unwind: '$createdAt',
            },
            {
                $match: {
                    course: { $eq: course },
                    createdAt: {
                        $gte: new Date(`${year}-01-01`),
                        $lte: new Date(`${year}-12-31`),
                    },
                },
            },
            {
                $group: {
                    _id: { $month: '$createdAt' },
                    numEnrolled: { $sum: 1 },
                    users: { $push: '$user' },
                },
            },
            {
                $addFields: { month: '$_id' },
            },
            {
                $project: {
                    _id: 0,
                },
            },
            {
                $sort: { month: 1 },
            },
        ]);

        res.status(200).json({
            status: 'success',
            data: {
                plan,
            },
        });
    } catch (err) {
        res.status(404).json({
            status: 'fail',
            message: err,
        });
    }
};


exports.getMonthlyTestStats = async (req, res) => {
    try {
        const year = req.params.year * 1;
        // const year = 2020;
        const course = mongoose.Types.ObjectId(req.body.course);
        // req.user && req.user.role !== 'admin'
        const match = !req.body.course ? {
            $match: {
                course: { $eq: course },
                createdAt: {
                    $gte: new Date(`${year}-01-01`),
                    $lte: new Date(`${year}-12-31`),
                },
            },
        }
            : {
                $match: {
                    createdAt: {
                        $gte: new Date(`${year}-01-01`),
                        $lte: new Date(`${year}-12-31`),
                    },
                },
            };

        console.log(match);
        const plan = await Enrollment.aggregate([
            {
                $unwind: '$createdAt',
            },
            { ...match },
            {
                $group: {
                    _id: { $month: '$createdAt' },
                    // numAnswered: { $sum: 1 },
                    avgTestScores: { $avg: '$test.score' },
                    users: { $push: '$user' },
                },
            },
            {
                $addFields: { month: '$_id' },
            },
            {
                $project: {
                    _id: 0,
                },
            },
            {
                $sort: { month: 1 },
            },
        ]);

        res.status(200).json({
            status: 'success',
            data: {
                plan,
            },
        });
    } catch (err) {
        res.status(404).json({
            status: 'fail',
            message: err,
        });
    }
};
