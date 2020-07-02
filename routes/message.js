const express = require('express');
const messageController = require('../controllers/message');
const authController = require('../controllers/auth');

const router = express.Router({ mergeParams: true });

router.use(authController.protect);

router.route('/')
    .get(messageController.setCourseUserIds, messageController.getAllMessages);

// router.route('/:id')
//     .get(messageController.getReview)
//     .patch(messageController.updateReview)
//     .delete(messageController.deleteReview);

module.exports = router;
