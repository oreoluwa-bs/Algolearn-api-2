/* eslint-disable func-names */
const mongoose = require('mongoose');

const reportedCoursesSchema = new mongoose.Schema({
    report: {
        type: String,
    },
    createdAt: {
        type: Date,
        default: Date.now(),
    },
    course: {
        type: mongoose.Schema.ObjectId,
        ref: 'Course',
        required: [true, 'A report must belong to a course'],
    },
    lesson: {
        type: mongoose.Schema.ObjectId,
        ref: 'Lesson',
    },
    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: [true, 'A report must belong to a user'],
    },
}, {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
});

reportedCoursesSchema.pre(/^find/, function (next) {
    this.populate({
        path: 'course',
        select: 'slug title',
    }).populate({
        path: 'lesson',
        select: 'slug title',
    }).populate({
        path: 'user',
        select: 'firstname lastname photo color',
    });

    next();
});

const ReportedCourse = mongoose.model('ReportedCourse', reportedCoursesSchema);

module.exports = ReportedCourse;
