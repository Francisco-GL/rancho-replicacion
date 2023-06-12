const express = require('express');
const MateriaPrima = require('../controllers/materiaPrima');
const router = express.Router();

router.get('/get-materiasPrimas', MateriaPrima.getMateriaPrima);
router.post('/save-materiaPrima', MateriaPrima.saveMateriaPrima);


module.exports = router;