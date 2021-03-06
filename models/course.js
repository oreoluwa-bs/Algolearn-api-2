/* eslint-disable no-underscore-dangle */
/* eslint-disable func-names */
const mongoose = require('mongoose');
const slugify = require('slugify');
const ColorHandler = require('../utils/colors');
const User = require('./user');

const courseSchema = new mongoose.Schema({
    title: {
        type: String,
        trim: true,
        maxlength: [50, 'A course name must have less or equal than 50 characters'],
        required: [true, 'A course must have a title'],
    },
    slug: String,
    description: {
        type: String,
        trim: true,
        required: [true, 'A course must have a description'],
    },
    difficulty: {
        type: String,
        required: [true, 'A course must have a skill level'],
        enum: {
            values: ['Beginner', 'Intermediate', 'Advanced'],
            message: 'Skill level is either beginner, intermediate, advanced',
        },
    },
    ratingsAverage: {
        type: Number,
        default: 3,
        min: [1, 'Rating must be above 1.0'],
        max: [5, 'Rating must be below 5.0'],
        set: (val) => Math.round(val * 10) / 10,
    },
    ratingsQuantity: {
        type: Number,
        default: 0,
    },
    lessonsQuantity: {
        type: Number,
        default: 0,
    },
    price: {
        type: Number,
        default: 0,
        required: [true, 'A course must have a price'],
    },
    author: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
    },
    color: String,
    enrollmentCount: {
        type: Number,
        default: 0,
    },
    testQuestionCount: {
        type: Number,
        default: 0,
    },
    createdAt: {
        type: Date,
        default: Date.now(),
        select: false,
    },
    isPublished: {
        type: Boolean,
        default: true,
    },
}, {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
});

// Virtual Data
courseSchema.virtual('reviews', {
    ref: 'Review',
    foreignField: 'course',
    localField: '_id',
});
courseSchema.virtual('lessons', {
    ref: 'Lesson',
    foreignField: 'course',
    localField: '_id',
});


// DOCUMENT MIDDLEWARE
courseSchema.pre('save', function (next) {
    const id = this._id.toString();
    this.slug = slugify(`${this.title} ${id.slice(id.length - 4)}`, { lower: true });

    this.color = new ColorHandler().generateRandomColor();
    next();
});

// courseSchema.post('save', async function () {
//     const author = await User.findById(this.author);
//     author.createdCourses.push(this._id);
//     author.saXve();
// });


// QUERY MIDDLEWARE
courseSchema.pre(/^find/, function (next) {
    this.find({ isPublished: { $ne: false } });
    next();
});
courseSchema.pre(/^find/, function (next) {
    this.populate({
        path: 'author',
        select: '+firstname +lastname +color +photo -createdCourses -email -enrollmentCount -role -passwordChangedAt',
    });
    next();
});

// AGGREGATION MIDDLEWARE
courseSchema.pre('aggregate', function (next) {
    this.pipeline().unshift({ $match: { isPublished: { $ne: false } } });
    next();
});

// STATIC METHODS
courseSchema.statics.calcCreatedCoursesCount = async function (authorId) {
    const stats = await this.aggregate([
        {
            $match: { author: authorId },
        },
        {
            $group: {
                _id: '$author',
                nCourses: { $sum: 1 },
            },
        },
    ]);
    await User.findByIdAndUpdate(authorId, {
        createdCoursesCount: stats[0].nCourses,
    });
};

courseSchema.post('save', function () {
    this.constructor.calcCreatedCoursesCount(this.author);
});

const Course = mongoose.model('Course', courseSchema);

module.exports = Course;
