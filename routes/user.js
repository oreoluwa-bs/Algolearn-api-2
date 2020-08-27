const express = require('express');
const userControl = require('../controllers/user');
const authControl = require('../controllers/auth');
const enrollRouter = require('./enroll');

const router = express.Router();

router.use('/me/enrolls', enrollRouter);

router.post('/signup', authControl.signup);
router.post('/login', authControl.login);
router.post('/forgotPassword', authControl.forgotPassword);
router.patch('/resetPassword/:token', authControl.resetPassword);


// Only logged in can use these routes
router.use(authControl.protect);

router.route('/')
    .get(authControl.restrictTo('admin'), userControl.getAllUsers);

router.patch('/updateMyPassword', authControl.updatePassword);

router.patch('/updateMe', userControl.updateMe);
router.delete('/deleteMe', userControl.deleteMe);


router.route('/me')
    .get(userControl.getMe, userControl.getUser)
    .patch(userControl.getMe, userControl.uploadUserPhoto,
        userControl.resizeUserPhoto, userControl.updateMe)
    .delete(userControl.getMe, userControl.deleteMe);

// router.route('/me/createdCourses')
//     .get(userControl.getMe, userControl.getMyCreatedCourses);

router.route('/stats/:year')
    .get(authControl.restrictTo('admin'), userControl.getMonthlyUserStats);

router.route('/dummy')
    // .get(authControl.restrictTo('admin'), userControl.getAllUsers)
    .post(authControl.restrictTo('admin'), userControl.createDummyUsers)
    .delete(authControl.restrictTo('admin'), userControl.deleteDummyUsers);

module.exports = router;
