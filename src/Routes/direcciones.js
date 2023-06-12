const express = require('express');
const Direcciones = require('../controllers/direcciones');
const router = express.Router();

router.get('/get-dataDirecciones', Direcciones.getDataDirecciones);
router.get('/get-dataDireccion/:id', Direcciones.getDataDireccion);
router.post('/create-direccion', Direcciones.createDireccion);
router.delete('/delete-direccion/:id', Direcciones.deleteDireccion);
router.put('/update-direccion/:id', Direcciones.updateDireccion);


module.exports = router;