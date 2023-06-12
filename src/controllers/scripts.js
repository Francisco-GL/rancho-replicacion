const ScriptsCtr = {};
const { connect, localConnection } = require('../../DBConexion');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const SECRET_KEY = process.env.SECRET_KEY;

// login
ScriptsCtr.validarUsuario = async (req, res) => {
    console.log(req.body);
    const Cuenta = req.body.Cuenta.user;
    const Contra = req.body.Contra.pass;
    const connection = await connect();
    console.log("Cuenta: " + Cuenta);
    console.log("Contra: " + Contra)
    // validar si existe
    const user = await connection.query('SELECT * FROM personal WHERE Cuenta = ?',[Cuenta]);
    if(user[0].length === 0){
        res.json({
            msg: 'Usuario no identificado',
            ok: false
        });
    } else {
        const contraPersonal = user[0][0].Contra;
        const validarPass = bcrypt.compareSync(Contra, contraPersonal);
        if (validarPass) {
            const expiresIn = 24 * 60 * 60;
            const accessToken = jwt.sign({ id: user.id }, SECRET_KEY, { expiresIn: expiresIn });
            const dataUser = {
                nombre: user[0][0].Nombre,
                cuenta: user[0][0].Cuenta,
                id: user[0][0].id,
                puesto: user[0][0].Puesto,
                accessToken: accessToken,
                expiresIn: expiresIn,
                ok: true
            }
            res.status(200).json(dataUser);
        } else {
            // password wrong
            res.status(409).send({
                msg: 'Algo anda mal',
                err: 'Nomina o Contraseña incorrecta',
                ok: false
            });
        }
    }
};

ScriptsCtr.query1 = async (req, res) => {
    const connection = await connect();

    const [data] = await connection.query('SELECT clientes.Nombre, COUNT(clientes.id_Cliente) AS NumberoVentasCliente FROM ventas LEFT JOIN clientes ON ventas.id_Cliente = clientes.id_Cliente GROUP BY Nombre');
    console.log(data);

    res.json(data);
};

ScriptsCtr.query2 = async (req, res) => {
    const connection = await connect();

    const [data] = await connection.query('SELECT id_Compra, SUM(Cantidad) as Cantidad, SUM(Precio_Unitario*Cantidad) AS total FROM compras GROUP BY id_compra HAVING total > 1000;');
    console.log(data);

    res.send(data);
};

ScriptsCtr.query3 = async (req, res) => {
    const connection = await connect();

    const [data] = await connection.query('SELECT COUNT(DISTINCT id_tipo_Animal) as count FROM animales;');
    console.log(data);

    res.send(data);
};

ScriptsCtr.query4 = async (req, res) => {
    const connection = await connect();

    const [data] = await connection.query('SELECT MAX(Precio) AS PrecioMaximo FROM ventas;');
    console.log(data);

    res.send(data);
};

ScriptsCtr.query5 = async (req, res) => {
    const connection = await connect();

    const [data] = await connection.query('SELECT MIN(Precio_Unitario) AS PrecioMenor FROM compras;');
    console.log(data);

    res.send(data);
};

ScriptsCtr.query6 = async (req, res) => {
    const connection = await connect();

    const [data] = await connection.query('SELECT id_Venta,Nombre,id_Producto, Cantidad, Total as "Pago_Total", Fecha from clientes, ventas where clientes.id_Cliente=ventas.id_Cliente;');
    console.log(data);

    res.send(data);
};

ScriptsCtr.query7 = async (req, res) => {
    const connection = await connect();

    const [data] = await connection.query('select  a.Nombre as Tipo_animal,b.id as id_alim,b.Nombre as Comida_Sugerida from tipo_animales a, alimento_animal b WHERE a.id_Alimento=b.id;');
    console.log(data);

    res.send(data);
};

ScriptsCtr.query8 = async (req, res) => {
    const connection = await connect();

    const [data] = await connection.query('SELECT proveedores.id_Proveedor, direcciones.calle, proveedores.RazonSocial, proveedores.Correo FROM proveedores LEFT JOIN direcciones ON direcciones.id = proveedores.id_Direccion;');
    console.log(data);

    res.send(data);
};

ScriptsCtr.query9 = async (req, res) => {
    const connection = await connect();

    const [data] = await connection.query('select Nombre,(PrecioUnitario*Cantidad) AS ValorProducto FROM alimento_venta;');
    console.log(data);

    res.send(data);
};


ScriptsCtr.query10 = async (req, res) => {
    const connection = await connect();

    const [data] = await connection.query('SELECT personal.id as id,personal.nombre AS PersonalRegistrado, actividades.Nombre AS ActividadDeTrabajo FROM personal LEFT JOIN actividades ON personal.id_Actividad=actividades.id;');
    console.log(data);

    res.send(data);
};

ScriptsCtr.query11 = async (req, res) => {
    const connection = await connect();

    const [data] = await connection.query('select id, colonia AS PuntoVenta, Municipio from clientes, direcciones where direcciones.id=clientes.id_Direccion;');
    console.log(data);

    res.send(data);
};
ScriptsCtr.query12 = async (req, res) => {
    const connection = await connect();

    const [data] = await connection.query('SELECT  id_Proveedor AS Vendedor,Nombre, Fecha AS FechaCompra from personal, compras WHERE personal.id=compras.id_Personal;');
    console.log(data);

    res.send(data);
};

ScriptsCtr.saveResponseTime = async (origen, localTime, serverTime) => {
    const connection = await localConnection();
    const [results] = await connection.query('INSERT INTO Tiempo_Respuesta (Peticion_Origen, TiempoLocal, TiempoServidor) VALUES (?,?,?)', [
        origen,
        localTime,
        serverTime
    ]);
    console.log('results -> ', results);
    return results;
};

module.exports = ScriptsCtr;