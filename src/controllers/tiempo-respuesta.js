const ResponseCtr = {};
const { connect, localConnection } = require('../../DBConexion');

ResponseCtr.getFasterServerResponseTime = async (req, res) => {
    const connection = await localConnection();
    const [rows] = await connection.query('SELECT * FROM Tiempo_Respuesta WHERE TiempoServidor = (SELECT MIN(TiempoServidor) from Tiempo_Respuesta)');
    rows.length === 0 ? res.json({
        msg: 'Sin registros',
        ok: false
    }) :
        res.json(rows);
};

ResponseCtr.getSlowestServerResponseTime = async (req, res) => {
    const connection = await localConnection();
    const [rows] = await connection.query('SELECT * FROM Tiempo_Respuesta WHERE TiempoServidor = (SELECT MAX(TiempoServidor) from Tiempo_Respuesta)');
    rows.length === 0 ? res.json({
        msg: 'Sin registros',
        ok: false
    }) :
        res.json(rows);
};

ResponseCtr.getBestResponseTime = async (req, res) => {
    const connection = await localConnection();
    const count = await connection.query('SELECT COUNT(*) FROM Tiempo_Respuesta');
    if (count[0][0]['COUNT(*)'] > 0) {
        const avrServerResponseTime = await connection.query('SELECT FORMAT(AVG(DISTINCT TiempoServidor), 2) FROM Tiempo_Respuesta');
        const avrLocalResponseTime = await connection.query('SELECT FORMAT(AVG(DISTINCT TiempoLocal), 2) FROM Tiempo_Respuesta');
        if ((avrLocalResponseTime[0][0]['FORMAT(AVG(DISTINCT TiempoLocal), 2)']) > (avrServerResponseTime[0][0]['FORMAT(AVG(DISTINCT TiempoServidor), 2)'])) {
            res.json({
                msg: `De ${count[0][0]['COUNT(*)']} registros se concluyó que las respuestas a la base de datos local es más efectiva`,
                ok: true
            });
        } else {
            res.json({
                msg: `De ${count[0][0]['COUNT(*)']} registros se concluyó que las respuestas a la base de datos servidores son más efectiva`,
                ok: true
            });
        }
    } else {
        res.json({
            msg: 'Sin registros para realizar estadistico',
            ok: false
        })
    }
};

module.exports = ResponseCtr;