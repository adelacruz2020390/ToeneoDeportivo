const express = require('express');
const EquipoControlador = require('../controllers/equipos.controller');

//moddleware 
const md_autenticacion = require('../middlewares/autenticacion');
const md_roles = require('../middlewares/roles');

const api = express.Router();

api.post('/crearEquipos' , [md_autenticacion.Auth] , EquipoControlador.crearEquipo);
api.get('/verEquipos/:idLiga', [md_autenticacion.Auth] ,EquipoControlador.verEquipos)
api.put('/EditarEquipo/:idEquipo', [md_autenticacion.Auth] ,EquipoControlador.editarEquipo)

api.get('/obtenerEquipo/:idEquipo', [md_autenticacion.Auth] ,EquipoControlador.obtenerEquipo)


module.exports = api;


