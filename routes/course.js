const express = require('express');
const CourseControl = require('../controllers/course');

const router = express.Router();

router.route('/')
    .get(CourseControl.getAllCourses)
    .post(CourseControl.createCourse);

router.route('/:slug')
    .get(CourseControl.getCourse)
    .patch(CourseControl.updateCourse)
    .delete(CourseControl.deleteCourse);

module.exports = router;
