const express = require('express');
const router = express.Router();
const specjalizacjaController = require('../controllers/specjalizacjaController.js');
router.get('/',specjalizacjaController.getAllSpcejcalizacje)
module.exports = router;