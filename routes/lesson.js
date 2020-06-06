const express = require('express');
const lessonController = require('../controllers/lesson');
const authController = require('../controllers/auth');

const router = express.Router({ mergeParams: true });

// router.use();

router.route('/')
    .get(lessonController.getAllLessons)
    .post(authController.protect, authController.restrictTo('tutor'), lessonController.setCourseUserIds, lessonController.isMyCourse, lessonController.createLesson);

router.route('/:id')
    .get(lessonController.getLesson)
    .patch(authController.protect, authController.restrictTo('tutor'), lessonController.setCourseUserIds, lessonController.isMyCourse, lessonController.updateLesson)
    .delete(authController.protect, authController.restrictTo('tutor'), lessonController.setCourseUserIds, lessonController.isMyCourse, lessonController.deleteLesson);

module.exports = router;
