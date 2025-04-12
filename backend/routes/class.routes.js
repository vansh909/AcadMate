const express = require('express');
const { classes } = require('../controllers/class.controller');
const router = express.Router();

router.post("/addclass/:id", classes)

module.exports = router;