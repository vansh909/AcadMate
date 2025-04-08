const express= require('express');
const router = express.Router();

const {signup, login}  = require('../controllers/User.controller');
const {isAuthenticated} = require('../middlewares/auth.middleware')

router.post('/signup',isAuthenticated, signup);



module.exports =router;