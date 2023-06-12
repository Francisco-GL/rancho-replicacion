const express = require('express');
const Clientes = require('../controllers/clientes');
const router = express.Router();

router.get('/get-dataClientes', Clientes.getDataClientes);
router.get('/get-dataCliente/:id_Cliente', Clientes.getDataCliente);
router.get('/get-clientes_count', Clientes.getClientesCount);
router.post('/create-cliente', Clientes.createCliente);
router.delete('/delete-cliente/:id_Cliente', Clientes.deleteCliente);
router.put('/update-cliente/:id_Cliente', Clientes.updateCliente);

module.exports = router;