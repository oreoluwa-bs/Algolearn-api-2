/* eslint-disable no-underscore-dangle */
/* eslint-disable func-names */
const mongoose = require('mongoose');
const slugify = require('slugify');
const Course = require('./course');

const lessonSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'A lesson must have a title'],
    },
    slug: String,
    video: String,
    text: String,
    course: {
        type: mongoose.Schema.ObjectId,
        ref: 'Course',
        required: [true, 'A review must belong to a course'],
    },
    // isPublic: {
    //     type: Boolean,
    //     default: true,
    // },
    createdAt: {
        type: Date,
        default: Date.now(),
        select: false,
    },
});

// lessonSchema.index({ course: 1 });
lessonSchema.index({ course: 1, slug: 1 }, { unique: true });

// DOCUMENT MIDDLEWARE
lessonSchema.pre('save', function (next) {
    const id = this._id.toString();
    this.slug = slugify(`${this.title} ${id.slice(id.length - 4)}`, { lower: true });
    next();
});

// STATIC METHODS
lessonSchema.statics.calcLessonCount = async function (courseId) {
    const stats = await this.aggregate([
        {
            $match: { course: courseId },
        },
        {
            $group: {
                _id: '$course',
                nLessons: { $sum: 1 },
            },
        },
    ]);
    await Course.findByIdAndUpdate(courseId, {
        lessonsQuantity: stats[0].nLessons,
    });
};

lessonSchema.post('save', function () {
    this.constructor.calcLessonCount(this.course);
});

const Lesson = mongoose.model('Lesson', lessonSchema);

module.exports = Lesson;
