/* eslint-disable func-names */
const mongoose = require('mongoose');

const lessonSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'A lesson must have a title'],
    },
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

lessonSchema.index({ course: 1 });

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
    console.log(stats);
    // await Course.findByIdAndUpdate(courseId, {
    //     lessonsQuatity: stats[0].nRatings,
    // });
};

lessonSchema.post('save', function () {
    this.constructor.calcLessonCount(this.course);
});

const Lesson = mongoose.model('Lesson', lessonSchema);

module.exports = Lesson;
