const express = require('express');
const questionController = require('../controllers/questions');
const authController = require('../controllers/auth');

const router = express.Router({ mergeParams: true });

router.use(authController.protect);

router.route('/')
    .get(questionController.getAllQuestions)
    .post(authController.restrictTo('tutor'), questionController.setCourseUserIds, questionController.isMyCourse, questionController.createQuestion);

router.route('/:id')
    .get(authController.restrictTo('tutor'), questionController.setCourseUserIds, questionController.isMyCourse, questionController.getQuestion)
    .patch(authController.restrictTo('tutor'), questionController.setCourseUserIds, questionController.isMyCourse, questionController.updateQuestion)
    .delete(authController.restrictTo('tutor'), questionController.setCourseUserIds, questionController.isMyCourse, questionController.deleteQuestion);

module.exports = router;
