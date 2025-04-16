const express= require('express');
const  {getStudentList}  = require('../controllers/teacher.controller');
const { isAuthenticated } = require('../middlewares/auth.middleware');
const router = express.Router();

router.get('/getStudentList', isAuthenticated, getStudentList);


module.exports =router;