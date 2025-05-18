const express = require('express');
const router = express.Router();
const lekarzController = require('../controllers/lekarzController.js');
const weryfikujRole = require("../middlewere/weryfikujRole");
router.get('/',lekarzController.getAllLekarze);
router.post('/:id',weryfikujRole(['admin']),lekarzController.addLekarz)
router.get('/:id',lekarzController.getLekarzById)
router.delete('/:id',weryfikujRole(['admin']),lekarzController.deleteLekarz);
router.put('/:id',weryfikujRole(['admin']),lekarzController.updateLekarz);
module.exports = router;