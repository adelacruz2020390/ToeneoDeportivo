const express = require('express');
const UsuarioControlador = require('../controllers/usuario.controller');

//moddleware 
const md_autenticacion = require('../middlewares/autenticacion');
const md_roles = require('../middlewares/roles');

const api = express.Router();


api.post('/login', UsuarioControlador.Login)
api.post('/Registrar' ,UsuarioControlador.RegistrarUsuarios)
api.post('/RegistrarAdmin' , [md_autenticacion.Auth , md_roles.verAdministrador] ,UsuarioControlador.RegistrarUsuariosAdmin);
api.put('/EditarUsuarios/:idUsuario' ,[md_autenticacion.Auth] ,UsuarioControlador.EditarUsuarios);
api.delete('/EliminarUsuario/:idUsuario' , [md_autenticacion.Auth] ,UsuarioControlador.EliminarUsuario)

module.exports = api;


