const express= require('express');
const router = express.Router();

const {signup, login}  = require('../controllers/User.controller');
const {isAuthenticated} = require('../middlewares/auth.middleware');


router.post('/signup',isAuthenticated, signup);
router.post("/login",login);



// In routes/user.js or wherever your /user/login route is
router.post('/login', async (req, res) => {
    console.log('Login request received:', req.body);
  });
  

module.exports =router;