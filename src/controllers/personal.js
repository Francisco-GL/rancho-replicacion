const PersonalCtr = {};
const { connect, localConnection } = require('../../DBConexion');
const bcrypt = require('bcryptjs');
const ScriptsCtr = require('./scripts');

PersonalCtr.getDataPersonal = async (req, res) => {
    const connection = await connect();
    const localDBConnection = await localConnection();
    const startServer = new Date();
    const [rows] = await connection.query('SELECT * FROM personal');
    const endServer = new Date();
    const serverTime = endServer - startServer;
    const startLocal = new Date();
    await localDBConnection.query('SELECT * FROM personal');
    const endLocal = new Date();
    const localTime = endLocal - startLocal;
    await ScriptsCtr.saveResponseTime('Personal', localTime, serverTime);
    rows.length === 0 ? res.json({
        msg: 'No existen registros',
        ok: false
    }) :
        res.json(rows);
};

PersonalCtr.getDataPersona = async (req, res) => {
    const id = req.params.id;
    const connection = await connect();
    const [rows] = await connection.query('SELECT * FROM personal WHERE id = ?', [
        id
    ]);
    rows.length === 0 ? res.json({
        msg: 'No existe el registro con el id: ' + id,
        ok: false
    }) :
        res.json(rows);
};

PersonalCtr.getPersonalCount = async (req, res) => {
    const connection = await connect();
    const [rows] = await connection.query('SELECT COUNT(*) FROM personal');
    res.json({
        TotalPersonal: rows[0]['COUNT(*)'],
        ok: true
    });
};

PersonalCtr.createPersona = async (req, res) => {
    const id_Actividad = req.body.id_Actividad;
    const id_Material = req.body.id_Material;
    const Nombre = req.body.Nombre;
    const Puesto = req.body.Puesto;
    const Salario = req.body.Salario;
    const Turno = req.body.Turno;
    const Estatus = req.body.Estatus;
    const Cuenta = req.body.Cuenta;
    const Contra = bcrypt.hashSync(req.body.Contra);
    const connection = await connect();

    // validacion 
    const act = await connection.query('SELECT * FROM actividades WHERE id = ?', [id_Actividad]);
    if (act[0].length === 0) {
        res.json({
            msg: 'Actividad no identificada',
            ok: false
        });
    } else {
        const matPrima = await connection.query('SELECT * FROM materiaprima WHERE id = ?', [id_Material]);
        if (matPrima[0].length === 0) {
            res.json({
                msg: 'Materia prima no identificada',
                ok: false
            });
        } else {
            const [results] = await connection.query('INSERT INTO personal (id_Actividad, id_Material, Nombre, Puesto, Salario, Turno, Estatus, Cuenta, Contra) VALUES (?,?,?,?,?,?,?,?,?)', [
                id_Actividad,
                id_Material,
                Nombre,
                Puesto,
                Salario,
                Turno,
                Estatus,
                Cuenta,
                Contra
            ]);
            res.json({
                id: results.insertId,
                ...req.body
            });
        }
    }
};

PersonalCtr.deletePersona = async (req, res) => {
    const id = req.params.id;
    const connection = await connect();
    const result = await connection.query('DELETE FROM personal WHERE id = ?', [id]);
    result[0].affectedRows !== 0 ?
        res.json({
            msg: 'Registro eliminado con exito',
            ok: true
        }) :
        res.json({
            msg: 'Error al eliminar...',
            ok: false
        });
}

PersonalCtr.updatePersona = async (req, res) => {
    const id = req.params.id;
    const connection = await connect();
    const result = await connection.query('UPDATE personal SET ? WHERE id = ?', [
        req.body,
        id
    ]);
    res.json(result);
};

module.exports = PersonalCtr;
