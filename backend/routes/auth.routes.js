const express = require('express');
const { refreshToken } = require('../controllers/auth.controller');
const router = express.Router();

router.post("/refreshToken", refreshToken);

module.exports = router;