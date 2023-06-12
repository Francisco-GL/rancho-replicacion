const ClientesCtr = {};
const { connect, localConnection } = require('../../DBConexion');
const ScriptsCtr = require('./scripts');

ClientesCtr.getDataClientes = async (req, res) => {
    const connection = await connect();
    const localDBConnection = await localConnection();
    const startServer = new Date();
    const [rows] = await connection.query('SELECT * FROM clientes');
    const endServer = new Date();
    const serverTime = endServer - startServer;
    const startLocal = new Date();
    await localDBConnection.query('SELECT * FROM clientes');
    const endLocal = new Date();
    const localTime = endLocal - startLocal;
    await ScriptsCtr.saveResponseTime('Clientes', localTime, serverTime);
    rows.length === 0 ? res.json({
        msg: 'No existen registros',
        ok: false
    }) :
        res.json(rows);
};

ClientesCtr.getDataCliente = async (req, res) => {
    const id_Cliente = req.params.id_Cliente;
    const connection = await localConnection();
    const [rows] = await connection.query('SELECT * FROM clientes WHERE id_Cliente = ?', [
        id_Cliente
    ]);
    rows.length === 0 ? res.json({
        msg: 'No existe el registro con el id: ' + id_Cliente,
        ok: false
    }) :
        res.json(rows);
};

ClientesCtr.getClientesCount = async (req, res) => {
    const connection = await localConnection();
    const [rows] = await connection.query('SELECT COUNT(*) FROM clientes');
    res.json({
        TotalClientes: rows[0]['COUNT(*)'],
        ok: true
    });
};

ClientesCtr.createCliente = async (req, res) => {
    const id_Direccion = req.body.id_Direccion;
    const Nombre = req.body.Nombre;
    const Correo = req.body.Correo;
    const Estatus = req.body.Estatus;
    const Cuenta = req.body.Cuenta;
    const Pass = req.body.Pass;

    const connection = await localConnection();

    // validacion
    const idDireccion = id_Direccion
    const [rows] = await connection.query('SELECT * FROM direcciones WHERE id = ?', [
        idDireccion
    ]);

    if (rows.length === 0) {
        res.json({
            msg: 'No existe el registro con la direccion con id: ' + idDireccion,
            ok: false
        });
    } else {
        const [results] = await connection.query('INSERT INTO clientes (id_Direccion, Nombre, Correo, Estatus, Cuenta, Pass) VALUES (?,?,?,?,?,sha(?))', [
            id_Direccion,
            Nombre,
            Correo,
            Estatus,
            Cuenta,
            Pass
        ]);
        res.json({
            id: results.insertId,
            ...req.body
        });
    }
    // --------
};

// actualizacion ya que se tiene que eliminar de igual forma la direccion del cliente
ClientesCtr.deleteCliente = async (req, res) => {
    const id_Cliente = req.params.id_Cliente;
    const connection = await localConnection();
    const [rows] = await connection.query('SELECT * FROM clientes WHERE id_Cliente = ?',[id_Cliente]);
    if(rows.length === 0){
        res.json({
            msj: 'Cliente no registrado',
            ok: false
        });
    } else {
        const id_Direccion = rows[0].id_Direccion;
        const direccion = await connection.query('SELECT * FROM direcciones WHERE id = ?',id_Direccion);
        const eliminarDireccion = await connection.query('DELETE FROM direcciones WHERE id = ?', [direccion[0][0].id]);
        const result = await connection.query('DELETE FROM clientes WHERE id_Cliente = ?', [id_Cliente]);
        if(result[0].affectedRows !== 0 && eliminarDireccion[0].affectedRows !== 0){
            res.json({
                msg: 'Cliente y direccion eliminada con exito',
                ok: true
            });
        } else if(eliminarDireccion[0].affectedRows === 0){
            res.json({
                msg: 'Error al eliminar la direccion...',
                ok: false
            });
        } else {
            res.json({
                msg: 'Error al eliminar ...',
                ok: false
            });
        }
    }
};

ClientesCtr.updateCliente = async (req, res) => {
    const id_Cliente = req.params.id_Cliente;
    const connection = await localConnection();
    // valida
    const idDireccion = req.body.id_Direccion;
    const [rows] = await connection.query('SELECT * FROM direcciones WHERE id = ?', [
        idDireccion
    ]);

    if (rows.length === 0) {
        res.json({
            msg: 'No existe direccion con el id: ' + idDireccion,
            ok: false
        });
    } else {
        const [rows] = await connection.query('SELECT * FROM clientes WHERE id_Cliente = ?', [
            id_Cliente
        ]);
        if (rows.length === 0) {
            res.json({
                msg: 'No existe Cliente con el id: ' + id_Cliente,
                ok: false
            });
        } else {
            const result = await connection.query('UPDATE clientes SET ? WHERE id_Cliente = ?', [
                req.body,
                id_Cliente
            ]);

            if (result[0].affectedRows === 0) {
                res.json({
                    msg: 'No se pudo modificar cliente con id: ' + id_Cliente,
                    ok: false
                });
            } else
                res.json(result);
        }
    }

};

module.exports = ClientesCtr;