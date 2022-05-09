const bcrypt = require("bcrypt-nodejs");
const jwt = require("../services/jwt");
const Usuario = require('../models/usuario.model')

function registrarAdmin() {
  var modeloUsuario = new Usuario();

  Usuario.find({ email: "ADMIN" }, (err, usuarioEncontrado) => {
    if (usuarioEncontrado.length > 0) {
      return console.log("el SuperAdmin Ya Esta Registrado");
    } else {
      modeloUsuario.nombre = "ADMIN";
      modeloUsuario.email = "ADMIN";
      modeloUsuario.rol = "ROL_ADMIN";

      bcrypt.hash("deportes123", null, null, (err, passwordEncriptada) => {
        modeloUsuario.password = passwordEncriptada;

        modeloUsuario.save((err, usuarioGuardado) => {
          if (err) return console.log("Error en la peticion");
          if (!usuarioGuardado) return console.log("Error al registrar Admin");

          return console.log("Admin:" + " " + usuarioGuardado);
        });
      });
    }
  });
}

function Login(req, res) {
  var parametros = req.body;

  Usuario.findOne({ email: parametros.email }, (err, usuarioEncontrado) => {
    if (err) return res.status(500).send({ mensaje: "Error en la peticion" });
    if (usuarioEncontrado) {
      // COMPARO CONTRASENA SIN ENCRIPTAR CON LA ENCRIPTADA
      bcrypt.compare(
        parametros.password,
        usuarioEncontrado.password,
        (err, verificacionPassword) => {
          //TRUE OR FALSE
          // VERIFICO SI EL PASSWORD COINCIDE EN BASE DE DATOS
          if (verificacionPassword) {
            // SI EL PARAMETRO OBTENERTOKEN ES TRUE, CREA EL TOKEN
            if (parametros.obtenerToken === "true") {
              return res
                .status(200)
                .send({ token: jwt.crearToken(usuarioEncontrado) });
            } else {
              usuarioEncontrado.password = undefined;
              return res.status(200).send({ usuario: usuarioEncontrado });
            }
          } else {
            return res
              .status(500)
              .send({ mensaje: "Las contrasena no coincide" });
          }
        }
      );
    } else {
      return res
        .status(500)
        .send({ mensaje: "Error, el correo no se encuentra registrado." });
    }
  });
}

function RegistrarUsuarios(req, res) {
  var parametro = req.body;
  var usuarioModel = new Usuario();

  if (parametro.nombre && parametro.email && parametro.password
  ) {

    usuarioModel.nombre = parametro.nombre;
    usuarioModel.email = parametro.email;
    usuarioModel.rol = "ROL_USUARIO";
    usuarioModel.password = parametro.password;


    Usuario.find({ email: parametro.email }, (err, usuarioEncontrado) => {
      if (usuarioEncontrado.length == 0) {
        bcrypt.hash(parametro.password, null, null, (err, passwordEncriptada) => {

          usuarioModel.password = passwordEncriptada;
          usuarioModel.save((err, usuarioGuardado) => {
            if (err) return res.status(500).send({ mensaje: "Error en la peticion" });
            if (!usuarioGuardado) return res.status(500).send({ mensaje: "Error al agregar El Usuario" });

            return res.status(200).send({ usuario: usuarioGuardado });
          });
        }
        );
      } else {
        return res.status(500).send({ mensaje: "Este Usuario ya a sido Creado" });
      }
    });
  } else {
    return res.status(500).send({ mensaje: "Enviar parametros obligatorios" });
  }
}

function RegistrarUsuariosAdmin(req, res) {
  var parametro = req.body;
  var usuarioModel = new Usuario();

  if (parametro.nombre && parametro.email && parametro.password
  ) {

    usuarioModel.nombre = parametro.nombre;
    usuarioModel.email = parametro.email;
    usuarioModel.rol = "ROL_USUARIO";
    usuarioModel.password = parametro.password;


    Usuario.find({ email: parametro.email }, (err, usuarioEncontrado) => {
      if (usuarioEncontrado.length == 0) {
        bcrypt.hash(parametro.password, null, null, (err, passwordEncriptada) => {

          usuarioModel.password = passwordEncriptada;
          usuarioModel.save((err, usuarioGuardado) => {
            if (err) return res.status(500).send({ mensaje: "Error en la peticion" });
            if (!usuarioGuardado) return res.status(500).send({ mensaje: "Error al agregar El Usuario" });

            return res.status(200).send({ usuario: usuarioGuardado });
          });
        }
        );
      } else {
        return res.status(500).send({ mensaje: "Este Usuario ya a sido Creado" });
      }
    });
  } else {
    return res.status(500).send({ mensaje: "Enviar parametros obligatorios" });
  }
}

function EditarUsuarios(req, res) {
  var idUser = req.params.idUsuario;
  var parametros = req.body;

  Usuario.findOne({ _id: idUser }, (err, usuarioEncontrado) => {
    if (req.user.rol == "ROL_ADMIN") {
      if (usuarioEncontrado.rol !== "ROL_USUARIO") {
        return res
          .status(500)
          .send({ mensaje: "No puede editar a otros administradores" });
      } else {
        Usuario.findByIdAndUpdate(idUser, { $set: { nombre: parametros.nombre, email: parametros.email }, }, { new: true }, (err, usuarioActualizado) => {
          if (err) return res.status(500).send({ mensaje: "Error en la peticon de editar-admin" });
          if (!usuarioActualizado)
            return res.status(500).send({ mensaje: "Error al editar usuario-admin" });

          return res.status(200).send({ usuario: usuarioActualizado });
        }
        );
      }
    } else {
      Usuario.findByIdAndUpdate(req.user.sub,
        {
          $set: { nombre: parametros.nombre, email: parametros.email },
        }, { new: true }, (err, usuarioActualizado) => {
          if (err) return res.status(500).send({ mensaje: "Error en la peticion" });
          if (!usuarioActualizado) return res.status(500).send({ mensaje: "Error al editar el Usuario" });

          return res.status(200).send({ usuario: usuarioActualizado });
        }
      );
    }
  });
}

function EliminarUsuario(req, res) {
  var idUsua = req.params.idUsuario;

  Usuario.findOne({ _id: idUsua }, (err, usuarioencotrado) => {
    if (req.user.rol !== "ROL_ADMIN") { // verirficamos el rol si es admin
      if (req.user.sub !== idUsua) { // verificamos que el id sea igual a id del cliente
        return res.status(500).send({ mensaje: 'no tienes permiso de eliminar este usuario' });
      } else { // else del id igaulid de cliente
        Usuario.findByIdAndDelete(req.user.sub, (err, UsuarioEliminado) => {
          if (err) return res.status(500).send({ mensaje: 'Error en la peticion' });
          if (!UsuarioEliminado) return res.status(500)
            .send({ mensaje: 'Error al eliminar el producto' })
          return res.status(200).send({ usuario: UsuarioEliminado });
        })
      }
    } else { // else de verificacion de rol admin
      if (usuarioencotrado.rol !== "ROL_ADMIN") { // aqui verificamos si el rol es de un admin si se deasea eliminar
        Usuario.findByIdAndDelete(idUsua, (err, UsuarioEliminado) => {
          if (err) return res.status(500).send({ mensaje: 'Error en la peticion' });
          if (!UsuarioEliminado) return res.status(500)
            .send({ mensaje: 'Error al eliminar el Eliminar al Usuario' })
          return res.status(200).send({ usuario: UsuarioEliminado });
        })
      } else {
        return res.status(500).send({ mensaje: 'no puedes eliminar a un admin' });
      }
    }
  })
}





module.exports = {
  registrarAdmin,
  Login,
  RegistrarUsuarios,
  RegistrarUsuariosAdmin,
  EditarUsuarios,
  EliminarUsuario
}