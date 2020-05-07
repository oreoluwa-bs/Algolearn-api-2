const express = require('express');
const enrollController = require('../controllers/enroll');
const authController = require('../controllers/auth');

const router = express.Router({ mergeParams: true });

router.use(authController.protect, enrollController.setCourseUserIds);

router.route('/')
    .get(enrollController.getAllEnrollments)
    .post(enrollController.isMyCourse, enrollController.createEnrollment);

router.route('/:id')
    .get(enrollController.getEnrollment)
    .patch(enrollController.isMyCourse, enrollController.updateEnrollment)
    .delete(enrollController.isMyCourse, enrollController.deleteEnrollment);


module.exports = router;
