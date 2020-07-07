/* eslint-disable no-unused-vars */
/* eslint-disable consistent-return */
const multer = require('multer');
const sharp = require('sharp');
const User = require('../models/user');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const factory = require('./handlerFactory');

const dummyStudent = require('../dummyData/usersStudent.json');
const dummyTutor = require('../dummyData/userTutor.json');
const dummyAdmin = require('../dummyData/userAdmin.json');

// const multerStorage = multer.diskStorage({
//     destination: (req, file, cb) => {
//         cb(null, 'public/images/users');
//     },
//     filename: (req, file, cb) => {
//         // user-{userId}-{TimeStamp}.jpg
//         const ext = file.mimetype.split('/')[1];
//         // eslint-disable-next-line no-underscore-dangle
//         cb(null, `user-${req.user._id}-${Date.now()}.${ext}`);
//     },
// });

const multerStorage = multer.memoryStorage();

const multerFilter = (req, file, cb) => {
    if (file.mimetype.startsWith('image')) {
        cb(null, true);
    } else {
        cb(new AppError('Not an image! Please upload only images.', 400), false);
    }
};

const upload = multer({
    storage: multerStorage,
    fileFilter: multerFilter,
});

exports.uploadUserPhoto = upload.single('photo');

exports.resizeUserPhoto = async (req, res, next) => {
    if (!req.file) return next();

    // eslint-disable-next-line no-underscore-dangle
    req.file.filename = `user-${req.user._id}-${Date.now()}.jpeg`;

    await sharp(req.file.buffer)
        .resize(500, 500)
        .toFormat('jpeg').jpeg({ quality: 90 })
        .toFile(`public/images/users/${req.file.filename}`);

    next();
};

const filterObject = (obj, ...allowedFields) => {
    const newObject = {};
    Object.keys(obj).forEach((el) => {
        if (allowedFields.includes(el)) newObject[el] = obj[el];
    });
    return newObject;
};

exports.getMe = (req, res, next) => {
    req.params.id = req.user.id;
    next();
};

exports.updateMe = catchAsync(async (req, res, next) => {
    // 1) Create error if user Posts password data
    if (req.body.password || req.body.Confirm) {
        return next(new AppError('This route is not for password updates. Please use /updateMyPassword', 400));
    }
    // 2) Update user document
    const filteredBody = filterObject(req.body, 'firstname', 'lastname', 'email');
    if (req.file) filteredBody.photo = req.file.filename;

    const updatedUser = await User.findByIdAndUpdate(req.user.id,
        filteredBody,
        { new: true, runValidators: true });

    res.status(200).json({
        status: 'success',
        data: {
            user: updatedUser,
        },
    });
});

exports.deleteMe = catchAsync(async (req, res, next) => {
    await User.findByIdAndUpdate(req.user.id, { active: false });
    res.status(200).json({
        status: 'success',
        data: null,
    });
});

exports.createUser = (req, res) => {
    res.status(500).json({
        status: 'error',
        message: 'This route is not yet defined! Please use /signup instead',
    });
};

exports.getAllUsers = factory.getAll(User);

exports.getUser = factory.getOne(User, 'enrolledCourses');

// Do not update passwords with this
exports.updateUser = factory.updateOne(User);

exports.deleteUser = factory.deleteOne(User);


exports.getMonthlyUserStats = async (req, res) => {
    try {
        const year = req.params.year * 1 ? req.params.year * 1 : new Date().getFullYear();
        const stats = await User.aggregate([
            {
                $unwind: '$createdAt',
            },
            {
                $match: {
                    createdAt: {
                        $gte: new Date(`${year}-01-01`),
                        $lte: new Date(`${year}-12-31`),
                    },
                },
            },
            {
                $group: {
                    _id: { $month: '$createdAt' },
                    numUsers: { $sum: 1 },
                },
            },
            {
                $addFields: { month: '$_id' },
            },
            {
                $project: {
                    _id: 0,
                },
            },
            {
                $sort: { month: 1 },
            },
        ]);
        const userCount = await User.countDocuments();
        res.status(200).json({
            status: 'success',
            data: {
                year,
                stats,
                userCount,
            },
        });
    } catch (err) {
        res.status(404).json({
            status: 'fail',
            message: err,
        });
    }
};

exports.createDummyUsers = (req, res, next) => {
    try {
        const dummies = [...dummyStudent, ...dummyTutor, ...dummyAdmin];

        dummies.forEach((dummy) => User.create(dummy));

        res.status(200).json({
            status: 'success',
            message: 'dummies created',
        });
    } catch (error) {
        res.status(400).json({
            status: 'error',
            message: 'dummies not created',
        });
    }
};

exports.deleteDummyUsers = (req, res, next) => {
    try {
        const dummies = [...dummyStudent, ...dummyTutor, ...dummyAdmin];

        dummies.forEach((dummy) => User.findOneAndDelete({ email: dummy.email }));

        res.status(201).json({
            status: 'success',
            message: 'dummies deleted',
        });
    } catch (error) {
        res.status(400).json({
            status: 'error',
            message: 'dummies not deleted',
        });
    }
};
