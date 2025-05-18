const express = require('express');
const router = express.Router();
const pacjentController = require('../controllers/pacjentController.js');
const weryfikujRole = require("../middlewere/weryfikujRole");
router.get('/',weryfikujRole(['lekarz','admin']),pacjentController.getAllPacjenci )
router.post('/:id',weryfikujRole(['admin']),pacjentController.addPacjent)
router.get('/:id',weryfikujRole(['lekarz','admin']),pacjentController.getPacjentById)
router.delete('/:id',weryfikujRole(['admin']),pacjentController.deletePacjent)
router.get('/identyfikator/:identyfikator',weryfikujRole(['lekarz','admin']),pacjentController.getPacjentByIdentyfikator)
module.exports = router;
