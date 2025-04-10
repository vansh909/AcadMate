const express = require('express')

const router = express.Router()
const{adminSignup, adminLogin} = require('../controllers/admin.controller')


router.post('/signup', adminSignup);
router.post('/login', adminLogin)

module.exports = router;