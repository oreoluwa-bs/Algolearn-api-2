/* eslint-disable consistent-return */
/* eslint-disable func-names */
const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const ColorHandler = require('../utils/colors');

const userSchema = new mongoose.Schema({
    firstname: {
        type: String,
        trim: true,
        required: [true, 'A user must have a first name'],
    },
    lastname: {
        type: String,
        trim: true,
        required: [true, 'A user must have a last name'],
    },
    email: {
        type: String,
        required: [true, 'Please provide your email'],
        unique: true,
        lowercase: true,
        validate: [validator.isEmail, 'Please provide a valid email'],
    },
    photo: String,
    color: String,
    role: {
        type: String,
        enum: ['student', 'tutor', 'admin'],
        default: 'student',
    },
    password: {
        type: String,
        required: [true, 'Please provide a password'],
        minlength: 6,
        select: false,
    },
    enrollmentCount: {
        type: Number,
        default: 0,
    },
    createdCoursesCount: {
        type: Number,
        default: 0,
    },
    passwordChangedAt: Date,
    passwordResetToken: String,
    passwordResetExpires: Date,
    active: {
        type: Boolean,
        default: true,
        select: false,
    },
    createdAt: {
        type: Date,
        default: Date.now(),
        select: false,
    },
}, {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
});

// userSchema.virtual('enrolledCourses', {
//     ref: 'Enrollment',
//     foreignField: 'user',
//     localField: '_id',
// });
// createdCourses: [
//     {
//         type: mongoose.Schema.ObjectId,
//         ref: 'Course',
//     },
// ],

// DOCUMENT MIDDLEWARE
userSchema.pre('save', async function (next) {
    // only runs if the password has been modified
    if (!this.isModified('password')) return next();
    this.password = await bcrypt.hash(this.password, 12);

    this.color = new ColorHandler().generateRandomColor();
    next();
});

userSchema.pre('save', function (next) {
    if (!this.isModified('password') || this.isNew) return next();

    this.passwordChangedAt = Date.now() - 1000;
    next();
});


// QUERY MIDDLEWARE
userSchema.pre(/^find/, function (next) {
    // This points to current query
    this.find({ active: { $ne: false } });
    next();
});

// userSchema.pre(/^find/, function (next) {
//     // this.populate({
//     //     path: 'enrolledCourses',
//     //     select: '-reviews -price -lessons -reviews',
//     // })
//     this.populate({
//         path: 'createdCourses',
//         select: '-reviews -price -lessons -reviews',
//     });

//     next();
// });


// INSTANCE METHODS
userSchema.methods.correctPassword = async function (candidatePassword, userPassword) {
    // eslint-disable-next-line no-return-await
    return await bcrypt.compare(candidatePassword, userPassword);
};

userSchema.methods.changedPasswordAfter = function (JWTTimestamp) {
    if (this.passwordChangedAt) {
        const changedTimeStamp = parseInt(this.passwordChangedAt.getTime() / 1000, 10);
        return JWTTimestamp < changedTimeStamp;
    }

    // false means not changed
    return false;
};

userSchema.methods.createPasswordResetToken = function () {
    const resetToken = crypto.randomBytes(32).toString('hex');

    this.passwordResetToken = crypto.createHash('sha256')
        .update(resetToken)
        .digest('hex');

    this.passwordResetExpires = Date.now() + 10 * 60 * 1000;

    return resetToken;
};


const User = mongoose.model('User', userSchema);

module.exports = User;
