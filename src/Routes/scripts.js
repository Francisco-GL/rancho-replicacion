const express = require('express');
const Scripts = require('../controllers/scripts');
const router = express.Router();

// login
router.post('/validar-usuario', Scripts.validarUsuario);
router.get('/query1', Scripts.query1);
router.get('/query2', Scripts.query2);
router.get('/query3', Scripts.query3);
router.get('/query4', Scripts.query4);
router.get('/query5', Scripts.query5);
router.get('/query6', Scripts.query6);
router.get('/query7', Scripts.query7);
router.get('/query8', Scripts.query8);
router.get('/query9', Scripts.query9);
router.get('/query10', Scripts.query10);
router.get('/query11', Scripts.query11);
router.get('/query12', Scripts.query12);



module.exports = router;