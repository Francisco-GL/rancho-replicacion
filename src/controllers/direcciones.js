const DireccionesCtr = {};
const { connect, localConnection } = require('../../DBConexion');
const ScriptsCtr = require('./scripts');

const ipServer = process.env.IP_ADDRES;
const portServer = process.env.PORT_SERVER;

DireccionesCtr.getDataDirecciones = async (req, res) => {
    const connection = await connect();
    const localDBConnection = await localConnection();
    const startServer = new Date();
    await connection.query('SELECT * FROM direcciones');
    const endServer = new Date();
    const serverTime = endServer - startServer;
    const startLocal = new Date();
    const [rows] = await localDBConnection.query('SELECT * FROM direcciones_desc');
    const endLocal = new Date();
    const localTime = endLocal - startLocal;
    await ScriptsCtr.saveResponseTime('Direcciones', localTime, serverTime);

    rows.length === 0 ? res.json({
        msg: 'No existen registros',
        ok: false
    }) : res.json(rows);
};

DireccionesCtr.getDataDireccion = async (req, res) => {
    const id = req.params.id;
    const connection = await localConnection();
    const [rows] = await connection.query('SELECT * FROM direcciones_desc WHERE id = ?', [
        id
    ]);

    rows.length === 0 ? res.json({
        msg: 'No existe el registro con el id: ' + id,
        ok: false
    }) :
        res.json(rows[0]);
};


DireccionesCtr.createDireccion = async (req, res) => {
    console.log('entre');
    const Calle = req.body.Calle;
    const Numero = req.body.Numero;
    const id = req.body.id;

    const connection = await localConnection();
    const [results] = await connection.query('INSERT INTO direcciones_desc (id, Calle, Numero) VALUES (?,?,?)', [
        id,
        Calle,
        Numero
    ]);

    res.json({
        id: results.insertId,
        ...req.body,
        ok: true
    });
};

DireccionesCtr.deleteDireccion = async (req, res) => {
    const id = req.params.id;
    const connection = await localConnection();

    const result = await connection.query('DELETE FROM direcciones_desc WHERE id = ?', [id]);

    if (result[0].affectedRows !== 0) {
        res.json({
            msg: 'Direccion eliminada con exito',
            ok: true
        });
    } else {
        res.json({
            msg: 'Error al eliminar...',
            ok: false
        });
    }
};

DireccionesCtr.updateDireccion = async (req, res) => {
    const id = req.params.id;
    const connection = await localConnection();
    const result = await connection.query('UPDATE direcciones SET ? WHERE id = ?', [
        req.body,
        id
    ]);
    res.json(result);
};

module.exports = DireccionesCtr;