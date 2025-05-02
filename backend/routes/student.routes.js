const express = require('express');
const router = express.Router();
const {studentProfile}= require('../controllers/student.controller')

const {isAuthenticated} = require('../middlewares/auth.middleware');

router.get('/profile', isAuthenticated, studentProfile);

module.exports = router;