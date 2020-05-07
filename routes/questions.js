const express = require('express');
const questionController = require('../controllers/questions');
const authController = require('../controllers/auth');

const router = express.Router({ mergeParams: true });

router.use(authController.protect, authController.restrictTo('tutor'), questionController.setCourseUserIds, questionController.isMyCourse);

router.route('/')
    .get(questionController.getAllQuestions)
    .post(questionController.createQuestion);

router.route('/:id')
    .get(questionController.getQuestion)
    .patch(questionController.updateQuestion)
    .delete(questionController.deleteQuestion);

module.exports = router;
