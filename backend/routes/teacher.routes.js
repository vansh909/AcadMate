const express = require('express');
const { getStudentsList, getClassLists, getTeacherProfile, uploadFile, addAttendace } = require('../controllers/teacher.controller');
const { isAuthenticated } = require('../middlewares/auth.middleware');
const  upload  = require('../middlewares/multer'); 

const router = express.Router();

router.get('/StudentList', isAuthenticated, getStudentsList);
router.get('/profile', isAuthenticated, getTeacherProfile);
router.get('/ClassesList', isAuthenticated, getClassLists);
router.post('/uploadfile', upload.single('file'), uploadFile); 
router.post('/attendance', isAuthenticated, addAttendace);

module.exports = router;