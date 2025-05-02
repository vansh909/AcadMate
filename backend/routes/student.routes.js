const express = require('express');
const router = express.Router();
const {studentProfile, getAttendance}= require('../controllers/student.controller')

const {isAuthenticated} = require('../middlewares/auth.middleware');

router.get('/profile', isAuthenticated, studentProfile);
router.get('/getAttendance', isAuthenticated, getAttendance);

module.exports = router;