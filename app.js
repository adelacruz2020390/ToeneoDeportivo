const express = require('express');
const cors = require('cors');
const app = express();

// IMPORTACION RUTAS

const usuarioRutas = require('./src/routes/usuario.routes')
const LigasRutas = require('./src/routes/ligas.routes')
const EquipoRutas = require('./src/routes/equipos.routes')
const JornadasRutas = require('./src/routes/jornada.routes')

// MIDDLEWARES
app.use(express.urlencoded({ extended: false}));
app.use(express.json());

// CABECERAS
app.use(cors());

// CARGA DE RUTAS localhost:3000/api/productos

app.use('/api' , usuarioRutas ,LigasRutas , EquipoRutas , JornadasRutas);

module.exports = app;