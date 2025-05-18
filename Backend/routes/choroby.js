const express = require('express');
const router = express.Router();
const weryfikujRole = require('../middlewere/weryfikujRole')
const chorobyController = require('../controllers/chorobyController');
router.get('/',weryfikujRole(['lekarz','admin']), chorobyController.getAllChoroby);
router.get('/:id',weryfikujRole(['lekarz','admin']), chorobyController.getChorobaById);
router.post('/',weryfikujRole(['admin']), chorobyController.addChoroba);
router.put('/:id',weryfikujRole(['admin']), chorobyController.putChoroba);
router.delete('/:id',weryfikujRole(['admin']), chorobyController.deleteChoroba);
module.exports = router;
