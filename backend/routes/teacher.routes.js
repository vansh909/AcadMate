const express= require('express');
const {getStudentsList} = require('../controllers/teacher.controller');
const {isAuthenticated} = require('../middlewares/auth.middleware')
const router = express.Router();

router.get('/StudentList',isAuthenticated, getStudentsList);



module.exports =router;