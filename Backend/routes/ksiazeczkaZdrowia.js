const express = require('express');
const router = express.Router();
const ksiazeczkaZdrowiaController = require('../controllers/ksiazeczkaZdrowiaController.js');
const weryfikujRole = require("../middlewere/weryfikujRole");
router.get('/',weryfikujRole(['lekarz','admin']),ksiazeczkaZdrowiaController.getAllKsiazeczki)
router.get('/ksiazeczkiL/:id',weryfikujRole(['lekarz','admin']),ksiazeczkaZdrowiaController.getKsiazeczkaByLekarzId)
router.get('/ksiazeczkiP/:id',weryfikujRole(['lekarz','admin','pacjent']),ksiazeczkaZdrowiaController.getKsiazeczkaByPacjentId)
router.get('/ksiazeczkiC/:id',weryfikujRole(['lekarz,admin']),ksiazeczkaZdrowiaController.getKsiazeczkaByChorobaId)
router.post("/",weryfikujRole(['lekarz','admin']),ksiazeczkaZdrowiaController.addKsiazeczka)
router.delete('/:id_pacjenta/:id_choroby/:data_wykrycia/:id_lekarza',weryfikujRole(['admin']),ksiazeczkaZdrowiaController.deleteKsiazeczka)
router.put('/:pacjent_id_pacjenta/:choroby_id',weryfikujRole(['lekarz']),ksiazeczkaZdrowiaController.putKsiazeczka)
module.exports = router;