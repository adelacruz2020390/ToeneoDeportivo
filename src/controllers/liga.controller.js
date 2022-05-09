const Liga = require("../models/ligas.model");
const Equipo = require("../models/equipos.model");
const Usuario = require('../models/usuario.model')

function crearLiga(req, res) {
    var parametros = req.body;
    var ligaModel = new Liga();

    if (req.user.rol !== 'ROL_ADMIN') {//verificamos si es admin
        if (parametros.nombre) {//verificaiones para usuario
            ligaModel.nombre = parametros.nombre;
            ligaModel.Usuarios = req.user.sub;
            Liga.findOne({ nombre: parametros.nombre, Usuarios: req.user.sub }, (err, ligaEncontrada) => {
                if (err) return res.status(500).send({ mensaje: 'error en la peticion' });
                if (!ligaEncontrada) { //si viene nulo crea uno nuevo

                    ligaModel.save((err, ligaGuardada) => {
                        if (err) return res.status(500).send({ mensaje: 'error en la peticion' });
                        if (!ligaGuardada) return res.status(500).send({ mensaje: 'no se guardó la liga' });
                        return res.status(200).send({ ligaGuardada });
                    });
                } else {//verificaion de usuario
                    return res.status(500).send({ mensaje: 'este liga ya existe' });
                }
            });
        } else {//verificaion de usuario
            return res.status(500).send({ mensaje: 'no puede dejar parametros vacios' });
        }
    } else { //verificaion de admin
        if (parametros.nombre, parametros.NombreDueno) {//verificaion de admin
            Usuario.findOne({ nombre: parametros.NombreDueno }, (err, duenoEncontrado) => {
                if (err) return res.status(500).send({ mensaje: "Error en la peticion" });
                if (!duenoEncontrado) return res.status(500).send({ mensaje: "Error al Encopntra El Usuario" });
                ligaModel.nombre = parametros.nombre;
                ligaModel.Usuarios = duenoEncontrado._id;
                Liga.findOne({ nombre: parametros.nombre, Usuarios: duenoEncontrado._id }, (err, ligaEncontrada) => {
                    if (err) return res.status(500).send({ mensaje: 'error en la peticion' });
                    if (!ligaEncontrada) {
                        ligaModel.save((err, ligaGuardada) => {
                            if (err) return res.status(500).send({ mensaje: 'error en la peticion' });
                            if (!ligaGuardada) return res.status(500).send({ mensaje: 'no se guardó la liga' });
                            return res.status(200).send({ ligaGuardada });
                        });
                    } else {//verificaion de admin
                        return res.status(500).send({ mensaje: 'este liga ya existe' });
                    }
                });
            })
        } else {//verificaion de admin
            return res.status(500).send({ mensaje: 'no puede dejar parametros vacios' });
        }
    }
}

function verLigas(req, res) {
    var idUser = req.params.idUsuario;
    if (req.user.rol !== 'ROL_ADMIN') {
        Liga.find({ Usuarios: req.user.sub }, (err, ligasEncontradas) => {
            if (err) return res.status(500).send({ mensaje: 'error en la peticion' });
            if (!ligasEncontradas) return res.status(500).send({ mensaje: 'Aún no hay ligas' });
            return res.status(200).send({ ligasEncontradas });
        });
    } else {

        if (idUser == null) {
            return res.status(500).send({ mensaje: 'admin debes de mandar un id' });
        } else {
            Liga.find({ Usuarios: idUser }, (err, ligasEncontradas) => {
                if (err) return res.status(500).send({ mensaje: 'error en la peticion' });
                if (!ligasEncontradas) return res.status(500).send({ mensaje: 'Aún no hay ligas' });
                return res.status(200).send({ ligasEncontradas });
            });
        }


    }
}

function editarLiga(req, res) {
    var parametros = req.body;
    var IdLiga = req.params.idLiga;
    if (req.user.rol !== 'ROL_ADMIN') {//verifia si eres admin
        Liga.findOne({ _id: IdLiga }, (err, ligaEncontrada) => {
            if (err) return res.status(500).send({ mensaje: 'error en la peticion' });
            if (!ligaEncontrada) return res.status(500).send({ mensaje: 'no se pudo encontrar la liga' });
            if (ligaEncontrada.Usuarios == req.user.sub) {
                delete parametros.Usuarios;
                Liga.findByIdAndUpdate(IdLiga, parametros, { new: true }, (err, ligaActualizada) => {
                    if (err) return res.status(500).send({ mensaje: 'error en la peticion' });
                    if (!ligaActualizada) return res.status(500).send({ mensaje: 'no se pudo actualizar la liga' })
                    return res.status(200).send({ ligaActualizada });
                });
            } else {
                res.status(500).send({ mensaje: 'no es tu liga' });
            }

        })
    } else {//entras admin
        delete parametros.Usuarios;
        Liga.findByIdAndUpdate(IdLiga, parametros, { new: true }, (err, ligaActualizada) => {
            if (err) return res.status(500).send({ mensaje: 'error en la peticion' });
            if (!ligaActualizada) return res.status(500).send({ mensaje: 'no se pudo actualizar la liga' })
            return res.status(200).send({ ligaActualizada });
        });
    }


}

//pendiente
function eliminarLiga(req, res) {

    var LigaId = req.params.id;

    Liga.findByIdAndDelete(LigaId, (err, ligaEliminada) => {
        if (err) return res.status(500).send({ mensaje: 'error en la peticion' });
        if (!ligaEliminada) res.status(500).send({ mensaje: 'no se pudo eliminar la liga' });

        Equipo.deleteMany({ liga: LigaId }, (err, equiposEliminados) => {
            if (err) return res.status(500).send({ mensaje: 'error en la peticion' });
            if (!equiposEliminados) res.status(500).send({ mensaje: 'no se pudo eliminar los equipos' });

            return res.status(200).send({ mensaje: 'se ha eliminado la liga' + ligaEliminada });
        });
    });

}

function obtenerLiga(req, res) {
    var IdLidga = req.params.idLiga;
    if (req.user.rol !== 'ROL_ADMIN') {
        Liga.findOne({ _id: IdLidga }, (err, LigaEncontrado) => {
            if (err) return res.status(500).send({ mensaje: "Error en peticion" });
            if (!LigaEncontrado) return res.status(500).send({ mensaje: "Error al encontrar liga" });

            if (req.user.sub == LigaEncontrado.Usuarios) {
                return res.status(200).send({ LigaEncontrado });
            } else {
                res.status(500).send({ mensaje: 'no es tu liga' });
            }
        })
    } else {
        Liga.findOne({ _id: IdLidga }, (err, LigaEncontrado) => {
            if (err) return res.status(500).send({ mensaje: "Error en peticion" });
            if (!LigaEncontrado) return res.status(500).send({ mensaje: "Error al encontrar liga" })
            return res.status(200).send({ LigaEncontrado });
        });
    }


}
module.exports = {
    crearLiga,
    verLigas,
    editarLiga,
    eliminarLiga,
    obtenerLiga
}