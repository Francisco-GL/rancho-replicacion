const AlimentoAnimalCtr = {};
const { connect, localConnection } = require('../../DBConexion');
const ScriptsCtr = require('./scripts');

AlimentoAnimalCtr.getDataAlimentos = async (req, res) => {
    const connection = await connect();
    const localDBConnection = await localConnection();
    const startServer = new Date();
    await connection.query('SELECT * FROM alimento_animal');
    const endServer = new Date();
    const serverTime = endServer - startServer;
    const startLocal = new Date();
    const [rows] = await localDBConnection.query('SELECT * FROM alimento_animal');
    const endLocal = new Date();
    const localTime = endLocal - startLocal;
    await ScriptsCtr.saveResponseTime('Alimento_Animal', localTime, serverTime);
    rows.length === 0 ? res.json({
        msg: 'No existen registros',
        ok: false
    }) :
        res.json(rows);
};

AlimentoAnimalCtr.getDataAlimento = async (req, res) => {
    const id = req.params.id;
    const connection = await localConnection();
    const [rows] = await connection.query('SELECT * FROM alimento_animal WHERE id = ?', [
        id
    ]);
    rows.length === 0 ? res.json({
        msg: 'No existe el registro con el id: ' + id,
        ok: false
    }) :
        res.json(rows);
};

AlimentoAnimalCtr.getAlimentoCount = async (req, res) => {
    const connection = await localConnection();
    const [rows] =  await connection.query('SLECT COUNT(*) FROM alimento_animal');
    res.json({
        TotalActividades: rows[0]['COUNT(*)'],
        ok: true
    });
};

AlimentoAnimalCtr.createAlimentoAnimal = async (req, res) => {
    const Nombre = req.body.Nombre;
    const Descripcion = req.body.Descripcion;
    const Cantidad = req.body.Cantidad;
    const TipoUnidad = req.body.TipoUnidad;
    const connection = await localConnection();
    const [results] = await connection.query('INSERT INTO alimento_animal(Nombre, Descripcion, Cantidad, TipoUnidad) VALUES (?,?,?,?)', [
        Nombre,
        Descripcion,
        Cantidad,
        TipoUnidad
    ]);
    res.json({
        id: results.insertId,
        ...req.body,
        ok: true,
    });
};

AlimentoAnimalCtr.deleteAlimentoAnimal = async (req, res) => {
    const id = req.params.id;
    const connection = await localConnection();
    const result = await connection.query('DELETE FROM alimento_animal WHERE id = ?', [id]);
    result[0].affectedRows !== 0 ?
        res.json({
            msg: 'Alimento de animal eliminada con exito',
            ok: true
        }) :
        res.json({
            msg: 'Error al eliminar...',
            ok: false
        });
};

AlimentoAnimalCtr.updateAlimentoAnimal = async (req, res) => {
    const id = req.params.id;
    const connection = await localConnection();
    const body = req.body;
    const data = await connection.query('SELECT * FROM alimento_animal WHERE id = ?',[id]);
    let resta = data[0][0].Cantidad - body.Cantidad;
    let objAlimento = {
        id: id,
        Nombre: data[0][0].Nombre,
        Descripcion: data[0][0].Descripcion,
        Cantidad: resta,
        TipoUnidad: data[0][0].TipoUnidad
    };
    const result = await connection.query('UPDATE alimento_animal SET ? WHERE id = ?', [
        objAlimento,
        id
    ]);
    res.json(result);
}; 

module.exports = AlimentoAnimalCtr;