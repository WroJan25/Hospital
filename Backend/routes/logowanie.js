const express = require('express');
const router = express.Router();
const logowanieController = require('../controllers/logowanieController.js');
router.post('/',logowanieController.logowanie)
module.exports = router;