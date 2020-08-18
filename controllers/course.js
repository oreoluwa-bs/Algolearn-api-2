/* eslint-disable no-underscore-dangle */
/* eslint-disable consistent-return */
const ContentBasedRecommender = require('content-based-recommender');
const mongoose = require('mongoose');
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
        .populate('reviews');
    // .populate('lessons');

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

exports.handleRecommendations = catchAsync(async (req, res, next) => {
    if (!req.params.id) {
        return next(new AppError('No document found with that ID', 404));
    }


    const recommender = new ContentBasedRecommender({
        minScore: 0.07,
        maxSimilarDocuments: 100,
    });


    const documents = await Course.find();

    const formatedDocuments = documents.map((course) => ({
        id: course._id,
        content: course.title,
    }));

    // start training
    recommender.train(formatedDocuments);

    // get top 10 similar items to document req.params.id
    const similarDocuments = recommender.getSimilarDocuments(req.params.id, 0, 4);

    const similarIds = similarDocuments.map((course) => course.id);

    const finalRecommendations = await Course.find({ _id: { $in: similarIds } });

    if (finalRecommendations.length < 1) {
        await Course.aggregate([
            { $match: { _id: { $ne: mongoose.Types.ObjectId(req.params.id) } } },
            { $sample: { size: 4 } }])
            .exec((_err, recommendations) => {
                if (_err) {
                    res.status(200).json({
                        status: 'success',
                        results: 0,
                        data: {
                            data: [],
                        },
                    });
                }
                Course.populate(recommendations,
                    {
                        path: 'author',
                        select: '+firstname +lastname +color +photo -createdCourses -email -enrollmentCount -role -passwordChangedAt',
                    }, (_errr, populatedRecommendations) => {
                        if (_errr) {
                            res.status(200).json({
                                status: 'success',
                                results: 0,
                                data: {
                                    data: [],
                                },
                            });
                        }
                        res.status(200).json({
                            status: 'success',
                            results: populatedRecommendations.length,
                            data: {
                                data: populatedRecommendations,
                            },
                        });
                    });
            });
    } else {
        res.status(200).json({
            status: 'success',
            results: finalRecommendations.length,
            data: {
                data: finalRecommendations,
            },
        });
    }
});
