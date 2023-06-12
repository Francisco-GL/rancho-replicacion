const dotenv = require('dotenv');
dotenv.config();

const MainServer = require('./src/MainServer/mainServer');

const mainServer = new MainServer(process.env.PORT);