/* eslint-disable func-names */
const mongoose = require('mongoose');
const Course = require('./course');

const reviewSchema = new mongoose.Schema({
    review: {
        type: String,
    },
    rating: {
        type: Number,
        min: 1,
        max: 5,
    },
    createdAt: {
        type: Date,
        default: Date.now(),
    },
    course: {
        type: mongoose.Schema.ObjectId,
        ref: 'Course',
        required: [true, 'A review must belong to a course'],
    },
    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: [true, 'A review must belong to a user'],
    },
}, {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
});

reviewSchema.index({ course: 1, user: 1 }, { unique: true });

reviewSchema.pre(/^find/, function (next) {
    this.populate({
        path: 'user',
        select: '+firstname +lastname +photo -enrolledCourses -createdCourses',
    });

    next();
});

reviewSchema.statics.calcAverageRatings = async function (courseId) {
    const stats = await this.aggregate([
        {
            $match: { course: courseId },
        },
        {
            $group: {
                _id: '$course',
                nRatings: { $sum: 1 },
                avgRating: { $avg: '$rating' },
            },
        },
    ]);
    await Course.findByIdAndUpdate(courseId, {
        ratingsAverage: stats[0].avgRating,
        ratingsQuatity: stats[0].nRatings,
    });
};

reviewSchema.post('save', function () {
    this.constructor.calcAverageRatings(this.course);
});
const Review = mongoose.model('Review', reviewSchema);

module.exports = Review;
