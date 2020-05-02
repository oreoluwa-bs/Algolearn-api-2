const express = require('express');
const userControl = require('../controllers/user');
const authControl = require('../controllers/auth');
const enrollRouter = require('./enroll');

const router = express.Router();

router.use('/me/enrolls', enrollRouter);

router.post('/signup', authControl.signup);
router.post('/login', authControl.login);
// router.post('/forgotPassword', authControl.forgotPassword);
// router.patch('/resetPassword/:token', authControl.resetPassword);


// Only logged in can use these routes
router.use(authControl.protect);

router.patch('/updateMyPassword', authControl.updatePassword);

router.patch('/updateMe', userControl.updateMe);
router.delete('/deleteMe', userControl.deleteMe);


router.route('/me')
    .get(userControl.getMe, userControl.getUser)
    .patch(userControl.getMe, userControl.updateMe)
    .delete(userControl.getMe, userControl.deleteMe);

// router.route('/me/createdCourses')
//     .get(userControl.getMe, userControl.getMyCreatedCourses);


module.exports = router;
