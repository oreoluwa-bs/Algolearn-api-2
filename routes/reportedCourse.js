const express = require('express');
const reportedCoursesController = require('../controllers/reportedCourses');
const authController = require('../controllers/auth');

const router = express.Router({ mergeParams: true });

router.use(authController.protect);

router.route('/create/:courseId')
    .post(reportedCoursesController.setCourseUserIds, reportedCoursesController.isMyCourse,
        reportedCoursesController.createReportedCourse);

router.use(authController.restrictTo('admin'));

router.route('/')
    .get(reportedCoursesController.getAllReportedCourses);


router.route('/:id')
    .get(reportedCoursesController.getReportedCourse)
    .patch(reportedCoursesController.isMyCourse, reportedCoursesController.updateReportedCourse)
    .delete(reportedCoursesController.isMyCourse, reportedCoursesController.deleteReportedCourse);

module.exports = router;
