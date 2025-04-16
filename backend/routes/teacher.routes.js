const express= require('express');
const  teacherController  = require('../controllers/teacher.controller');
const { isAuthenticated } = require('../middlewares/auth.middleware');
const router = express.Router();

router.get('/getStudentList', isAuthenticated, teacherController.getStudentList);


module.exports =router;