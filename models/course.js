/* eslint-disable func-names */
const mongoose = require('mongoose');
const slugify = require('slugify');

const courseSchema = new mongoose.Schema({
    title: {
        type: String,
        trim: true,
        maxlength: [50, 'A tour name must have less or equal than 40 characters'],
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
        // set: (val) => Math.round(val * 10) / 10,
    },
    ratingsQuatity: {
        type: Number,
        default: 0,
    },
    price: {
        type: Number,
        default: 0,
        required: [true, 'A tour must have a price'],
    },
    author: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
    },
    color: String,
    createdAt: {
        type: Date,
        default: Date.now(),
        select: false,
    },
    isPublished: {
        type: Boolean,
        default: false,
    },
}, {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
});

// DOCUMENT MIDDLEWARE
courseSchema.pre('save', function (next) {
    // eslint-disable-next-line no-underscore-dangle
    const id = this._id.toString();
    this.slug = slugify(`${this.title} ${id.slice(id.length - 4)}`, { lower: true });
    next();
});

// QUERY MIDDLEWARE
courseSchema.pre(/^find/, function (next) {
    this.find({ isPublished: { $ne: false } });
    next();
});
courseSchema.pre(/^find/, function (next) {
    this.populate({
        path: 'author',
        select: 'firstname lastname _id',
    });
    next();
});

// AGGREGATION MIDDLEWARE
courseSchema.pre('aggregate', function (next) {
    this.pipeline().unshift({ $match: { isPublished: { $ne: false } } });
    next();
});

const Course = mongoose.model('Course', courseSchema);

module.exports = Course;
