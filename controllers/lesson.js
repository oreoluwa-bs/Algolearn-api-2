/* eslint-disable no-underscore-dangle */
/* eslint-disable consistent-return */
const fs = require('fs');
const multer = require('multer');
const Lesson = require('../models/lesson');
const Course = require('../models/course');
const AppError = require('../utils/appError');
const factory = require('./handlerFactory');

const multerStorage = multer.memoryStorage();

const multerFilter = (req, file, cb) => {
    if (file.mimetype.startsWith('video')) {
        cb(null, true);
    } else {
        cb(new AppError('Not an video! Please upload only vidoes.', 400), false);
    }
};

const upload = multer({
    storage: multerStorage,
    fileFilter: multerFilter,
});

exports.uploadLessonVideo = upload.single('video');


exports.saveVideo = async (req, res, next) => {
    if (!req.file) return next();

    const ext = req.file.mimetype.split('/')[1];
    req.file.filename = `course-${req.params.courseId}-${Date.now()}.${ext}`;

    const writeStream = fs.createWriteStream(`public/videos/courses/${req.file.filename}`);

    writeStream.write(req.file.buffer, 'base64');

    writeStream.on('finish', () => {
        // console.log(req.body.video, 'h');
    });

    // close the stream
    writeStream.end();

    req.body.video = req.file.filename;
    next();
};

exports.setCourseUserIds = (req, res, next) => {
    if (!req.body.course) req.body.course = req.params.courseId;
    next();
};

exports.isMyCourse = async (req, res, next) => {
    const course = await Course.findById(req.body.course);
    if (course && course.author.id !== req.user.id) {
        return next(new AppError('You do not have permission to perform this action', 403));
    }
    next();
};


exports.getAllLessons = factory.getAll(Lesson);

exports.getLesson = factory.getOne(Lesson);

exports.createLesson = factory.createOne(Lesson);

exports.updateLesson = factory.updateOne(Lesson);

exports.deleteLesson = factory.deleteOne(Lesson);
