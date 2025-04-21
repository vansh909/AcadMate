const express= require('express');
const {getStudentsList, getClassLists, getTeacherProfile} = require('../controllers/teacher.controller');
const {isAuthenticated} = require('../middlewares/auth.middleware')
const router = express.Router();

router.get('/StudentList',isAuthenticated, getStudentsList);
router.get('/profile', isAuthenticated, getTeacherProfile);
router.get('/ClassesList', isAuthenticated, getClassLists)



module.exports =router;