const express = require('express');
const router = express.Router();
const Ventas = require('../controllers/ventas');

router.get('/get-ventas', Ventas.getDataVentas);
router.get('/get-venta/:id_Venta', Ventas.getDataVenta);
router.get('/get-ventasCount', Ventas.getVentasCount);
router.post('/create-venta', Ventas.createVenta);
router.delete('/delete-venta/:id_Venta/:id_Cliente', Ventas.deleteVenta);

module.exports = router;