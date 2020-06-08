/* eslint-disable func-names */
const mongoose = require('mongoose');
const Course = require('./course');

const testOptionSchema = new mongoose.Schema({
    text: {
        type: String,
        required: [true, 'A test option must have a text'],
    },
    key: {
        type: String,
        required: [true, 'A test option must have a key'],
    },
});

const testQuestionSchema = new mongoose.Schema({
    question: {
        type: String,
        required: [true, 'A test question must ask a question'],
    },
    correctOption: testOptionSchema,
    options: [testOptionSchema],
    course: {
        type: mongoose.Schema.ObjectId,
        ref: 'Course',
        required: [true, 'A test question must belong to a course'],
    },
    createdAt: {
        type: Date,
        default: Date.now(),
        select: false,
    },
});

// STATIC METHODS
testQuestionSchema.statics.calcTestQuestionCount = async function (courseId) {
    const stats = await this.aggregate([
        {
            $match: { course: courseId },
        },
        {
            $group: {
                _id: '$course',
                nTestQuestion: { $sum: 1 },
            },
        },
    ]);
    await Course.findByIdAndUpdate(courseId, {
        testQuestionCount: stats[0].nTestQuestion,
    });
};

testQuestionSchema.post('save', function () {
    this.constructor.calcTestQuestionCount(this.course);
});


const TestQuestion = mongoose.model('TestQuestion', testQuestionSchema);

module.exports = TestQuestion;
