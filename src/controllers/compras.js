const ComprasCtr = {};
const { connect, localConnection } = require('../../DBConexion');
const ScriptsCtr = require('./scripts');

const axios = require('axios');

const ipServer = process.env.IP_ADDRES;
const portServer = process.env.PORT_SERVER;

ComprasCtr.getDataCompras = async (req, res) => {
    const connection = await connect();
    const localDBConnection = await localConnection();
    const startServer = new Date();
    await connection.query('SELECT * FROM compras');
    const endServer = new Date();
    const serverTime = endServer - startServer;
    const startLocal = new Date();
    const [rows] = await localDBConnection.query('SELECT * FROM compras');
    const endLocal = new Date();
    const localTime = endLocal - startLocal;
    await ScriptsCtr.saveResponseTime('Compras', localTime, serverTime);

    rows.length === 0 ? res.json({
        msg: 'No existen registros',
        ok: false
    }) :
        res.json(rows);
};

ComprasCtr.getDataCompra = async (req, res) => {
    const id_Compra = req.params.id_Compra;
    const connection = await localConnection();
    const [rows] = await connection.query('SELECT * FROM compras WHERE id_Compra = ?', [
        id_Compra
    ]);
    rows.length === 0 ? res.json({
        msg: 'No existe el registro de Compra con el id: ' + id_Compra,
        ok: false
    }) :
        res.json(rows);
};

ComprasCtr.getComprasCount = async (req, res) => {
    const connection = await localConnection();
    const result = await connection.query('SELECT * FROM compras');
    if (result[0].length === 0) {
        res.json({
            msg: 'Sin registros de compras...',
            ok: false
        });
    } else {
        const [rows] = await connection.query('SELECT COUNT(*) FROM compras');
        res.json({
            TotalCompras: rows[0]['COUNT(*)'],
            ok: true
        });
    }
};

ComprasCtr.createCompra = async (req, res) => {
    const id_Proveedor = req.body.id_Proveedor;
    const id_Producto = req.body.id_Producto;
    const id_Personal = req.body.id_Personal;
    const Cantidad = req.body.Cantidad;
    const Precio_Unitario = req.body.Precio_Unitario;
    const Fecha = new Date();
    const onlyUpdate = req.body.onlyUpdate;
    const valueToChange = req.body.valueToChange
    console.log('body: ', req.body);

    // validacion
    const connection = await localConnection();

    const data = await connection.query('SELECT * FROM alimento_animal WHERE id = ?', [id_Producto]);
    const cantidad = data[0][0].Cantidad;
    if (!onlyUpdate) {
        const [results] = await connection.query('INSERT INTO compras_mayores (id_Proveedor,id_Producto, id_Personal, Cantidad, Precio_Unitario, Fecha) VALUES (?,?,?,?,?,?)', [
            id_Proveedor,
            id_Producto,
            id_Personal,
            Cantidad,
            Precio_Unitario,
            Fecha
        ]);

        let sum = 0;
        sum = cantidad + Cantidad;
        let objUpdate = {
            id: id_Producto,
            Nombre: data[0][0].Nombre,
            Descripcion: data[0][0].Descripcion,
            Cantidad: sum,
            TipoUnidad: data[0][0].TipoUnidad
        };

        await connection.query('UPDATE alimento_animal SET ? WHERE id = ?', [
            objUpdate,
            id_Producto
        ]);
    } else {
        let objUpdate = {
            id: id_Producto,
            Nombre: data[0][0].Nombre,
            Descripcion: data[0][0].Descripcion,
            Cantidad: valueToChange,
            TipoUnidad: data[0][0].TipoUnidad
        };

        await connection.query('UPDATE alimento_animal SET ? WHERE id = ?', [
            objUpdate,
            id_Producto
        ]);
    }

    res.json({
        id: results.insertId,
        ...req.body
    });

};

// maybe no se use 
ComprasCtr.deleteCompra = async (req, res) => {
    const id_Compra = req.params.id_Compra;
    const connection = await localConnection();
    const [rows] = await connection.query('SELECT * FROM compras_mayores WHERE id_Compra = ?', [
        id_Compra
    ]);

    if (rows.length === 0) {
        res.json({
            msg: 'Compra no existente con id ' + id_Compra,
            ok: false
        });
    } else {
        const result = await connection.query('DELETE FROM compras_mayores WHERE id_Compra = ?', [id_Compra]);
        result[0].affectedRows !== 0  ?
            res.json({
                msg: 'Compra eliminada con exito',
                ok: true
            }) :
            res.json({
                msg: 'Error al eliminar...',
                ok: false
            });
    }
};

module.exports = ComprasCtr;