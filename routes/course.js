const express = require('express');
const courseControl = require('../controllers/course');
const authControl = require('../controllers/auth');
const reviewRouter = require('./review');

const router = express.Router();

router.use('/:courseId/reviews', reviewRouter);

router.route('/')
    .get(courseControl.getAllCourses)
    .post(authControl.protect, authControl.restrictTo('tutor'), courseControl.setCourseUserIds, courseControl.createCourse);

router.route('/:slug')
    .get(courseControl.getCourse)
    .patch(authControl.protect, authControl.restrictTo('tutor'), courseControl.updateCourse)
    .delete(authControl.protect, authControl.restrictTo('tutor'), courseControl.deleteCourse);

module.exports = router;
