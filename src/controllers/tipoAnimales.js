const TipoAnimales = {};
const { connect, localConnection } = require('../../DBConexion');
const ScriptsCtr = require('./scripts');

TipoAnimales.getDataTipoAnimales = async (req, res) => {
    const connection = await connect();
    const localDBConnection = await localConnection();
    const startServer = new Date();
    const [rows] = await connection.query('SELECT * FROM tipo_animales');
    const endServer = new Date();
    const serverTime = endServer - startServer;
    const startLocal = new Date();
    await localDBConnection.query('SELECT * FROM tipo_animales');
    const endLocal = new Date();
    const localTime = endLocal - startLocal;
    await ScriptsCtr.saveResponseTime('Tipo_Animal', localTime, serverTime);
    rows.length === 0 ? res.json({
        msg: 'No existen registros',
        ok: false
    }) :
        res.json(rows);
};

TipoAnimales.getDataTipoAnimal = async (req, res) => {
    const id = req.params.id;
    const connection = await connect();
    const [rows] = await connection.query('SELECT * FROM tipo_animales WHERE id = ?', [
        id
    ]);
    rows.length === 0 ? res.json({
        msg: 'No existe el registro con el id: ' + id,
        ok: false
    }) :
        res.json(rows);
};

TipoAnimales.getTipoAnimalesCount = async (req, res) => {
    const connection = await connect();
    const result = await connection.query('SELECT * FROM tipo_animales');
    if (result[0].length === 0) {
        res.json({
            msg: 'Sin registros de Tipo Animales...',
            ok: false
        });
    } else {
        const [rows] = await connection.query('SELECT COUNT(*) FROM tipo_animales');
        res.json({
            TotalTipoAnimales: rows[0]['COUNT(*)'],
            ok: true
        });
    }
};

TipoAnimales.createTipoAnimal = async (req, res) => {
    const id_Alimento = req.body.id_Alimento;
    const id_Alimento_Venta = req.body.id_Alimento_Venta;
    const id_Personal = req.body.id_Personal;
    const Nombre = req.body.Nombre;
    const Cantidad = req.body.Cantidad;
    const Precio = req.body.Precio;
    const Comida = req.body.Comida;

    // validacion
    const connection = await connect();
    const alimento = await connection.query('SELECT * FROM tipo_animales WHERE id = ?', [id_Alimento]);

    if (alimento[0].length === 0) {
        res.json({
            msg: 'No existe alimento animal con id: ' + id_Alimento,
            ok: false
        });
    } else {
        const alimentoVenta = await connection.query('SELECT * FROM tipo_animales WHERE id = ?', [id_Alimento_Venta]);
        if (alimentoVenta[0].length === 0) {
            res.json({
                msg: 'No existe alimento venta con id: ' + id_Alimento_Venta,
                ok: false
            });
        } else {
            const personal = await connection.query('SELECT * FROM personal WHERE id = ?', [id_Personal]);
            if (personal[0].length === 0) {
                res.json({
                    msg: 'No existe el personal con id: ' + id_Personal,
                    ok: false
                });
            } else {
                const [results] = await connection.query('INSERT INTO tipo_animales (id_Alimento, id_Alimento_Venta, id_Personal, Nombre, Cantidad, Precio, Comida) VALUES (?,?,?,?,?,?,?)', [
                    id_Alimento,
                    id_Alimento_Venta,
                    id_Personal,
                    Nombre,
                    Cantidad,
                    Precio,
                    Comida
                ]);
                res.json({
                    id: results.insertId,
                    ...req.body,
                    ok:true,
                });
            }
        }
    }
};

TipoAnimales.deleteTipoAnimal = async (req, res) => {
    const id = req.params.id;
    const connection = await connect();
    const result = await connection.query('DELETE FROM tipo_animales WHERE id = ?', [id]);
    result[0].affectedRows !== 0 ?
        res.json({
            msg: 'Tipo Animal eliminado con exito',
            ok: true
        }) :
        res.json({
            msg: 'Error al eliminar...',
            ok: false
        });
};

TipoAnimales.updateTipoAnimal = async (req, res) => {
    const id = req.params.id;
    const connection = await connect();
    const result = await connection.query('UPDATE tipo_animales SET ? WHERE id = ?', [
        req.body,
        id
    ]);
    res.json(result);
};

module.exports = TipoAnimales;