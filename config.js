const ConfiguracionLocal = {
    host: process.env.HOST,
    user: process.env.USER,
    password: process.env.PASSWORD,
    database: process.env.DATABASE
};

const ConfiguracionDispositivo = {
    host: process.env.HOST2,
    user: process.env.USER2,
    password: process.env.PASSWORD2,
    database: process.env.DATABASE2
}

module.exports = {
    ConfiguracionLocal,
    ConfiguracionDispositivo
};