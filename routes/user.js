const express = require('express');
// const userControl = require('../controllers/user');
const authControl = require('../controllers/auth');

const router = express.Router();

router.post('/signup', authControl.signup);
router.post('/login', authControl.login);
// router.post('/forgotPassword', authControl.forgotPassword);
// router.patch('/resetPassword/:token', authControl.resetPassword);

module.exports = router;
