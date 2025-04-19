const express= require('express');
const {getStudentsList, getClassLists} = require('../controllers/teacher.controller');
const {isAuthenticated} = require('../middlewares/auth.middleware')
const router = express.Router();

router.get('/StudentList',isAuthenticated, getStudentsList);
router.get('/ClassesList', isAuthenticated, getClassLists)



module.exports =router;