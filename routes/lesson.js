const express = require('express');
const lessonController = require('../controllers/lesson');
const authController = require('../controllers/auth');

const router = express.Router({ mergeParams: true });

router.use(authController.protect, authController.restrictTo('tutor'), lessonController.setCourseUserIds, lessonController.isMyCourse);

router.route('/')
    .get(lessonController.getAllLessons)
    .post(lessonController.createLesson);

router.route('/:id')
    .get(lessonController.getLesson)
    .patch(lessonController.updateLesson)
    .delete(lessonController.deleteLesson);

module.exports = router;
