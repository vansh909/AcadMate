const express = require('express');
const router = express.Router();
const { isAuthenticated } = require('../middlewares/auth.middleware');
const upload = require('../middlewares/multer');
const { addAssignment, getAllAssignments } = require('../controllers/assignment.controller');

router.post('/addAssignment', isAuthenticated, upload.single('file'), addAssignment);
router.get('/assignmentList', getAllAssignments);

module.exports = router;