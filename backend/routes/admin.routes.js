const express = require('express');

const router = express.Router();
const{adminSignup, adminLogin, mappingTeacherSubjectClass, classes, getClasses, getSubjects, getTeachers} = require('../controllers/admin.controller');
const {addSubject} = require('../controllers/subject.controller');
const {isAuthenticated} = require('../middlewares/auth.middleware');

router.post('/subject', isAuthenticated,addSubject);
router.post('/signup', adminSignup);
router.post('/login', adminLogin);
router.post("/addclass",isAuthenticated,classes);
router.post('/mapping', isAuthenticated, mappingTeacherSubjectClass);
router.get('/classes', isAuthenticated, getClasses);
router.get('/teachers', isAuthenticated, getTeachers);
router.get('/subjects', isAuthenticated, getSubjects);





module.exports = router;