const express = require('express')

const router = express.Router()
const{adminSignup, adminLogin, mappingTeacherSubjectClass, classes} = require('../controllers/admin.controller')
const {addSubject} = require('../controllers/subject.controller')
const {isAuthenticated} = require('../middlewares/auth.middleware')

router.post('/subject', isAuthenticated,addSubject)
router.post('/signup', adminSignup);
router.post('/login', adminLogin)
router.post("/addclass/:id",isAuthenticated,classes)
router.post('/mapping', isAuthenticated, mappingTeacherSubjectClass);



module.exports = router;