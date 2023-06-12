const express = require('express');
const router = express.Router();
const Compras = require('../controllers/compras');

router.get('/get-compras', Compras.getDataCompras);
router.get('/get-compra/:id_Compra', Compras.getDataCompra);
router.get('/get-comprasCount', Compras.getComprasCount);
router.post('/create-compra', Compras.createCompra);
router.delete('/delete-compra/:id_Compra', Compras.deleteCompra);

module.exports = router;