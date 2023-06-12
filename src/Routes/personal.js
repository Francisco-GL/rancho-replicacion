const express = require('express');
const Personal = require('../controllers/personal');
const router = express.Router();

router.get('/get-dataPersonal', Personal.getDataPersonal);
router.get('/get-dataPersona/:id', Personal.getDataPersona);
router.get('/get-persona_count', Personal.getPersonalCount);
router.post('/create-persona', Personal.createPersona);
router.delete('/delete-persona/:id', Personal.deletePersona);
router.put('/update-persona/:id', Personal.updatePersona);

module.exports = router;