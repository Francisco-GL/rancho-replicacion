const express = require('express');
const Proveedores = require('../controllers/proveedores');
const router = express.Router();

router.get('/get-dataProveedores', Proveedores.getDataProveedores);
router.get('/get-dataProveedor/:id_Proveedor', Proveedores.getDataProveedor);
router.get('/get-proveedores_count', Proveedores.getProveedoresCount);
router.post('/create-proveedor', Proveedores.createProveedor);
router.delete('/delete-proveedor/:id_Proveedor', Proveedores.deleteProveedor);
router.put('/update-proveedor/:id_Proveedor', Proveedores.updateProveedor);

module.exports = router;