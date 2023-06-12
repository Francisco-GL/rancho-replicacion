const express = require('express');
const TipoAnimales = require('../controllers/tipoAnimales');
const router = express.Router();

router.get('/get-tipo_animales', TipoAnimales.getDataTipoAnimales);
router.get('/get-tipo_animal/:id', TipoAnimales.getDataTipoAnimal);
router.get('/get-tipo_animales_count', TipoAnimales.getTipoAnimalesCount);
router.post('/create-tipo_animal', TipoAnimales.createTipoAnimal);
router.delete('/delete-tipo_animal/:id', TipoAnimales.deleteTipoAnimal);
router.put('/update-tipo_animal/:id', TipoAnimales.updateTipoAnimal);

module.exports = router;