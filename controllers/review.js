const Review = require('../models/review');
const factory = require('./handlerFactory');

exports.setCourseUserIds = (req, res, next) => {
    // Allows nested routes
    if (!req.body.course) req.body.course = req.params.courseId;
    if (!req.body.user) req.body.user = req.user.id;
    next();
};


exports.getAllReviews = factory.getAll(Review);

exports.getReview = factory.getOne(Review);

exports.createReview = factory.createOne(Review);

exports.updateReview = factory.updateOne(Review);

exports.deleteReview = factory.deleteOne(Review);
