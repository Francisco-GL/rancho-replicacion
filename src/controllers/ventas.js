const VentasCtr = {};
const { connect, localConnection } = require('../../DBConexion');
const ScriptsCtr = require('./scripts');

VentasCtr.getDataVentas = async (req, res) => {
    const connection = await connect();
    const localDBConnection = await localConnection();
    const startServer = new Date();
    await connection.query('SELECT * FROM ventas');
    const endServer = new Date();
    const serverTime = endServer - startServer;
    const startLocal = new Date();
    const [rows] = await localDBConnection.query('SELECT * FROM ventas');
    const endLocal = new Date();
    const localTime = endLocal - startLocal;
    await ScriptsCtr.saveResponseTime('Ventas', localTime, serverTime);

    rows.length === 0 ? res.json({
        msg: 'No existen registros',
        ok: false
    }) :
        res.json(rows);
};

VentasCtr.getDataVenta = async (req, res) => {
    const id_Venta = req.params.id_Venta;
    const connection = await connect();
    const [rows] = await connection.query('SELECT * FROM ventas WHERE id_Venta = ?', [
        id_Venta
    ]);
    rows.length === 0 ? res.json({
        msg: 'No existe el registro con el id: ' + id_Venta,
        ok: false
    }) :
        res.json(rows);
};

VentasCtr.getVentasCount = async (req, res) => {
    const connection = await connect();
    const result = await connection.query('SELECT * FROM ventas');
    if (result[0].length === 0) {
        res.json({
            msg: 'Sin registros de ventas...',
            ok: false
        });
    } else {
        const [rows] = await connection.query('SELECT COUNT(*) FROM ventas');
        res.json({
            TotalVentas: rows[0]['COUNT(*)'],
            ok: true
        });
    }
};

VentasCtr.createVenta = async (req, res) => {
    const id_Cliente = req.body.id_Cliente;
    const id_Producto = req.body.id_Producto;
    const Cantidad = req.body.Cantidad;
    const Fecha = new Date();
    const table = req.body.table;

    // validacion
    const connection = await connect();
    const [rows] = await connection.query('SELECT * FROM clientes WHERE id_Cliente = ?', [
        id_Cliente
    ]);
    if (rows.length === 0) {
        res.json({
            msg: 'No existe Cliente con id: ' + id_Cliente,
            ok: false
        });
    } else {
        const renglon = await connection.query('SELECT * FROM alimento_venta WHERE id = ?', [id_Producto]);

        if (renglon[0].length === 0) {
            res.json({
                msg: 'No existe Producto venta: ' + id_Cliente,
                ok: false
            });
        } else {
            const precioUnitario = renglon[0][0].PrecioUnitario;
            const total = precioUnitario * Cantidad;
            const [results] = await connection.query(`INSERT INTO ${table} (id_Cliente,id_Producto,Cantidad, Precio, Total, Fecha) VALUES (?,?,?,?,?,?)`, [
                id_Cliente,
                id_Producto,
                Cantidad,
                precioUnitario,
                total,
                Fecha
            ]);
            const alimento = await connection.query('SELECT * FROM alimento_venta WHERE id = ?', [id_Producto]);
            let resta = 0;
            resta = alimento[0][0].Cantidad - Cantidad;
            let objAlimento = {
                id: alimento[0][0].id,
                Nombre: alimento[0][0].Nombre,
                PrecioUnitario: alimento[0][0].PrecioUnitario,
                Cantidad: resta,
                TipoUnidad: alimento[0][0].TipoUnidad
            };
            await connection.query('UPDATE alimento_venta SET ? WHERE id = ?', [
                objAlimento,
                id_Producto
            ]);
            res.json({
                id: results.insertId,
                ...req.body
            });
        }

    }
};

VentasCtr.deleteVenta = async (req, res) => {
    const id_Venta = req.params.id_Venta;
    const id_Cliente = req.params.id_Cliente;
    const connection = await connect();

    const [rows] = await connection.query('SELECT * FROM ventas WHERE id_Venta = ? AND id_Cliente = ?', [
        id_Venta,
        id_Cliente
    ]);
    if (rows.length === 0) {
        res.json({
            msg: 'La venta no realizada al cliente ' + id_Cliente,
            ok: false
        });
    } else {
        const result = await connection.query('DELETE FROM ventas WHERE id_Venta = ?', [id_Venta]);
        result[0].affectedRows !== 0 ?
            res.json({
                msg: 'Venta eliminada con exito',
                ok: true
            }) :
            res.json({
                msg: 'Error al eliminar...',
                ok: false
            });
    }
};

module.exports = VentasCtr;