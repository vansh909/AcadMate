const express = require('express')

const router = express.Router()
const{adminSignup, adminLogin} = require('../controllers/admin.controller')
const {addSubject} = require('../controllers/subject.controller')
const {isAuthenticated} = require('../middlewares/auth.middleware')

router.post('/subject', isAuthenticated,addSubject)
router.post('/signup', adminSignup);
router.post('/login', adminLogin)



module.exports = router;