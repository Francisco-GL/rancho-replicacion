const express = require('express');
const Actividades = require('../controllers/actividades');
const router = express.Router();

router.get('/get-activities', Actividades.getActividades);
router.get('/get-activity/:id', Actividades.getActividad);
router.get('/get-activities_count', Actividades.getActivitiesCount);
router.post('/create-activity', Actividades.saveActivity);
router.delete('/delete-activity/:id', Actividades.deleteActividad);
router.put('/update-activity/:id', Actividades.updateActividad);


module.exports = router;