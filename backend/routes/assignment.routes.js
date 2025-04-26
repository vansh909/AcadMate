const express = require('express');
const router = express.Router();
const { isAuthenticated } = require('../middlewares/auth.middleware');
const upload = require('../middlewares/multer');
const { addAssignment } = require('../controllers/assignment.controller');

router.post('/addAssignment', isAuthenticated, upload.single('file'), addAssignment);

module.exports = router;