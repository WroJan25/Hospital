const express = require('express');
const router = express.Router();
const weryfikujId = require("../middlewere/weryfikujId")
const uzytkownikController = require('../controllers/uzytkownikController.js');
const weryfikujRole = require("../middlewere/weryfikujRole");
router.get('/',uzytkownikController.getAllUzytkownicy )
router.get('/:id',weryfikujId(),uzytkownikController.getUzytkownikById)
router.delete('/:id',weryfikujRole(['admin']),uzytkownikController.deleteUzytkownik)
router.post('/',uzytkownikController.addUzytkownik)
router.put('/:id',weryfikujId(),uzytkownikController.updateUzytkownik)
module.exports = router;