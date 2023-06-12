const express = require('express');
const AlimentoVenta = require('../controllers/alimentoVenta');
const router = express.Router();

router.get('/get-dataAlimentoVenta', AlimentoVenta.getDataAlimentoVenta);
router.get('/get-dataAlimento/:id', AlimentoVenta.getDataAlimento);
router.post('/create-alimento', AlimentoVenta.createAlimento);
router.delete('/delete-alimento/:id', AlimentoVenta.deleteAlimento);
router.put('/update-alimento/:id', AlimentoVenta.updateAlimento);

module.exports = router;