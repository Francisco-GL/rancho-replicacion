const express = require('express');
const router = express.Router();
const ResponseController = require('../controllers/tiempo-respuesta');

router.get('/faster-serverResponse', ResponseController.getFasterServerResponseTime);
router.get('/slowest-serverResponse', ResponseController.getSlowestServerResponseTime);
router.get('/best-responseTime', ResponseController.getBestResponseTime);

module.exports = router;