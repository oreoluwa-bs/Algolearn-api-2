/* eslint-disable func-names */
const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
    content: {
        type: String,
        required: [true, 'A message must have content'],
    },
    createdAt: {
        type: Date,
        default: Date.now(),
    },
    course: {
        type: mongoose.Schema.ObjectId,
        ref: 'Course',
        required: [true, 'A message must belong to a course'],
    },
    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: [true, 'A message must belong to a user'],
    },
}, {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
});

messageSchema.index({ course: 1 });
messageSchema.index({ user: 1 });

messageSchema.pre(/^find/, function (next) {
    this.populate({
        path: 'user',
        select: '+firstname +lastname +photo +color -enrolledCourses -createdCourses',
    });

    next();
});

const Message = mongoose.model('Message', messageSchema);

module.exports = Message;
