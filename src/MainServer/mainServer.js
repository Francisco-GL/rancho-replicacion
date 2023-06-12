const express = require('express');
const morgan = require('morgan');
const cors = require('cors');

// routes
const Scripts = require('../Routes/scripts');
const Actividades = require('../Routes/actividades');
const MateriasPrimas = require('../Routes/materiaPrima');
const Direcciones = require('../Routes/direcciones');
const Alimento = require('../Routes/alimentoAnimal');
const Clientes = require('../Routes/clientes');
const Proveedores = require('../Routes/proveedores');
const Personal = require('../Routes/personal');
const AlimentoVenta = require('../Routes/alimentoVenta');
const Ventas = require('../Routes/ventas');
const Compras = require('../Routes/compras');
const TipoAnimales = require('../Routes/tipoAnimales');
const Animales = require('../Routes/animales');
const ResponseTime = require('../Routes/tiempo-respuesta');

class MainServer {
    // endpoints
    EndPointActivities = '/activities';
    EndPointMateriaPrima = '/materiaPrima';
    EndPointDirecciones = '/direcciones';
    EndPointAlimento = '/alimentoAnimal';
    EndPointClientes = '/clientes';
    EndPointProveedores = '/proveedores';
    EndPointPersonal = '/personal';
    EndPointAlimentoVenta = '/alimentoVenta';
    EndPointVentas = '/ventas';
    EndPointCompras = '/compras';
    EndPointTipoAnimales = '/tipoAnimales';
    EndPointAnimales = '/animales';
    EndPointScripts = '/login';
    EndPointResponse = '/response';
    
    constructor(port) {
        this.port = port;
        this.app = express();
        this.middleWares();
        this.asingRoutes();
        this.app.listen(port,()=>{
            console.log('Server listening port: '+port);
        });
    }

    middleWares() {
        this.app.use(express.json());
        this.app.use(morgan('dev'));
        this.app.use(cors());
        this.app.use((req, res, next) => {
            res.header('Access-Control-Allow-Origin', '*');
            res.header('ACcess-Control-Allow-Headers', 'Authorization, X-API-Kew, Origin, X-Requested-With, Content-Type, Access-Control-Request-Method');
            res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
            res.header('Allow', 'GET, POST, OPTIONS, PUT, DELETE');
            next();
        });

    }


    asingRoutes() {
        this.app.use(this.EndPointActivities, Actividades);
        this.app.use(this.EndPointMateriaPrima, MateriasPrimas);
        this.app.use(this.EndPointDirecciones, Direcciones);
        this.app.use(this.EndPointAlimento, Alimento);
        this.app.use(this.EndPointClientes, Clientes);
        this.app.use(this.EndPointProveedores, Proveedores);
        this.app.use(this.EndPointPersonal, Personal);
        this.app.use(this.EndPointAlimentoVenta, AlimentoVenta);
        this.app.use(this.EndPointVentas, Ventas);
        this.app.use(this.EndPointCompras, Compras);
        this.app.use(this.EndPointTipoAnimales, TipoAnimales);
        this.app.use(this.EndPointAnimales, Animales);
        this.app.use(this.EndPointScripts, Scripts);
        this.app.use(this.EndPointResponse, ResponseTime);
        this.app.get('/', (req, res) => {
            res.json('Test BackendMySQLNodeJS');
        });
    }
}

module.exports = MainServer;