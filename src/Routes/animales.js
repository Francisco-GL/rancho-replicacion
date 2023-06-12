const express = require('express');
const Animales = require('../controllers/animales');
const router = express.Router();

router.get('/get-animales', Animales.getDataAnimales);
router.get('/get-animal/:id_Animal', Animales.getDataAnimal);
router.get('/get-animales_count', Animales.getAnimalesCount);
router.post('/create-animal', Animales.createAnimal);
router.delete('/delete-animal/:id_Animal', Animales.deleteAnimal);
router.put('/update-animal/:id_Animal', Animales.updateAnimales);

module.exports = router;