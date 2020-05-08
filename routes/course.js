const express = require('express');
const courseControl = require('../controllers/course');
const authControl = require('../controllers/auth');
const reviewRouter = require('./review');
const lessonRouter = require('./lesson');

const router = express.Router();

router.use('/:courseId/reviews', reviewRouter);
router.use('/:courseId/lessons', lessonRouter);

router.route('/')
    .get(courseControl.getAllCourses)
    .post(authControl.protect, authControl.restrictTo('tutor'), courseControl.setCourseUserIds, courseControl.createCourse);

router.route('/:slug')
    .get(courseControl.getCourse);

router.route('/:id')
    .patch(authControl.protect, authControl.restrictTo('tutor'), courseControl.updateCourse)
    .delete(authControl.protect, authControl.restrictTo('tutor'), courseControl.deleteCourse);

router.route('/enroll/:courseId')
    .patch(authControl.protect, courseControl.enrollInCourse)
    .delete(authControl.protect, courseControl.unEnrollInCourse);

module.exports = router;
