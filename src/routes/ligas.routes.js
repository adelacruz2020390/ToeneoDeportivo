const express = require('express');
const LigasControlador = require('../controllers/liga.controller');

//moddleware 
const md_autenticacion = require('../middlewares/autenticacion');
const md_roles = require('../middlewares/roles');

const api = express.Router();


api.post('/Crearliga',[md_autenticacion.Auth] ,LigasControlador.crearLiga)
api.get('/Verligas/:idUsuario?', [md_autenticacion.Auth] , LigasControlador.verLigas)
api.put('/Editar/:idLiga' , [md_autenticacion.Auth] , LigasControlador.editarLiga)
api.get('/ObtenerLigas/:idLiga' , [md_autenticacion.Auth] , LigasControlador.obtenerLiga)


module.exports = api;


