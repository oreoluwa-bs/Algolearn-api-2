/* eslint-disable func-names */
const mongoose = require('mongoose');
const Course = require('./course');
const User = require('./user');

const enrollmentSchema = new mongoose.Schema({
    progress: {
        type: String,
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

enrollmentSchema.index({ course: 1, user: 1 }, { unique: true });

enrollmentSchema.pre(/^find/, function (next) {
    this.populate({
        path: 'course',
        // select: 'title slug description',
    });

    next();
});

enrollmentSchema.statics.calcCourseEnrollment = async function (courseId) {
    const stats = await this.aggregate([
        {
            $match: { course: courseId },
        },
        {
            $group: {
                _id: '$course',
                nEnrolls: { $sum: 1 },
            },
        },
    ]);
    await Course.findByIdAndUpdate(courseId, {
        enrollmentCount: stats[0].nEnrolls,
    });
};

enrollmentSchema.statics.calcUserEnrollment = async function (userId) {
    const stats = await this.aggregate([
        {
            $match: { user: userId },
        },
        {
            $group: {
                _id: '$user',
                nEnrolls: { $sum: 1 },
            },
        },
    ]);
    await User.findByIdAndUpdate(userId, {
        enrollmentCount: stats[0].nEnrolls,
    });
};

enrollmentSchema.post('save', function () {
    this.constructor.calcCourseEnrollment(this.course);
    this.constructor.calcUserEnrollment(this.user);
});

const Enrollment = mongoose.model('Enrollment', enrollmentSchema);

module.exports = Enrollment;
