const express = require('express');
const AlimentoAnimal = require('../controllers/alimentoAnimal');
const router = express.Router();

router.get('/get-dataAlimentos', AlimentoAnimal.getDataAlimentos);
router.get('/get-dataAlimento/:id', AlimentoAnimal.getDataAlimento);
router.get('/get-alimento_count', AlimentoAnimal.getAlimentoCount);
router.post('/create-alimentoAnimal', AlimentoAnimal.createAlimentoAnimal);
router.delete('/delete-alimentoAnimal/:id', AlimentoAnimal.deleteAlimentoAnimal);
router.put('/update-alimentoAnimal/:id', AlimentoAnimal.updateAlimentoAnimal);


module.exports = router;