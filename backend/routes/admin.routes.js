const express = require('express')

const router = express.Router()
const{adminSignup} = require('../controllers/admin.controller')


router.post('/signup', adminSignup);

module.exports = router;