const express= require('express');
const {getStudentsList, getClassLists, getTeacherProfile} = require('../controllers/teacher.controller');
const {isAuthenticated} = require('../middlewares/auth.middleware')
const router = express.Router();
const { uploadFile } = require('../controllers/teacher.controller');
const upload = require('../config/multer');

router.get('/StudentList',isAuthenticated, getStudentsList);
router.get('/profile', isAuthenticated, getTeacherProfile);
router.get('/ClassesList', isAuthenticated, getClassLists);
router.post('/uploadfile', upload.single('image'), uploadFile);



module.exports =router;