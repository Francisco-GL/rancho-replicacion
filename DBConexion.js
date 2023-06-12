const mysql = require('mysql2/promise');
const { ConfiguracionLocal, ConfiguracionDispositivo } = require('./config');

const connect = async () => {
    const conn = await mysql.createConnection(process.env.DATABASE_URL);
    return conn;
}

const localConnection = async () => {
    const conn = await mysql.createConnection(ConfiguracionLocal);
    return conn;
}

// Conexión con base de datos en otro dispositivo bajo la misma red
const OtherDeviceConnection = async () => {
    const conn = await mysql.createConnection(ConfiguracionDispositivo);
    return conn;
}

module.exports = {
    connect,
    localConnection,
    OtherDeviceConnection
};