const express = require('express');
const JornadasControlador = require('../controllers/jornadas.controller');

//moddleware 
const md_autenticacion = require('../middlewares/autenticacion');
const md_roles = require('../middlewares/roles');

const api = express.Router();

api.post('/crearJornada' , [md_autenticacion.Auth] , JornadasControlador.crearJornada)
api.post('/Resultado1' , [md_autenticacion.Auth] ,JornadasControlador.agregarResultado1 )



module.exports = api;


