const express = require('express');
const reviewController = require('../controllers/review');
const authController = require('../controllers/auth');

const router = express.Router({ mergeParams: true });

router.use(authController.protect);

router.route('/')
    .get(reviewController.getAllReviews)
    .post(reviewController.setCourseUserIds,
        reviewController.createReview);

router.route('/:id')
    .get(reviewController.getReview)
    .patch(reviewController.updateReview)
    .delete(reviewController.deleteReview);

module.exports = router;
