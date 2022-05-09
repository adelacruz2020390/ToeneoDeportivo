const Liga = require("../models/ligas.model");
const Equipo = require("../models/equipos.model");
const Usuario = require('../models/usuario.model')


function crearEquipo(req, res) {

    var parametros = req.body;
    var EquipoModel = new Equipo();

    if (req.user.rol !== 'ROL_ADMIN') {
        if (parametros.nombre && parametros.liga) {
            Liga.findOne({ nombre: parametros.liga }, (err, LigaEncontrada) => {
                if (err) return res.status(500).send({ mensaje: 'error en la peticion1 ' });
                if (!LigaEncontrada) return res.status(500).send({ mensaje: 'no hay ligas' })
                if (LigaEncontrada.Usuarios == req.user.sub) {
                    EquipoModel.nombre = parametros.nombre;
                    EquipoModel.liga = LigaEncontrada._id;
                    EquipoModel.puntos = 0;
                    EquipoModel.golesFavor = 0;
                    EquipoModel.golesContra = 0;
                    EquipoModel.diferenciaGoles = 0;
                    Equipo.findOne({ nombre: parametros.nombre, liga: LigaEncontrada._id, usuario: req.user.sub }, (err, equipoEncontrado) => {
                        if (err) return res.status(500).send({ mensaje: 'error en la peticion 2' });
                        if (!equipoEncontrado) {
                            Equipo.find({ liga: LigaEncontrada._id }, (err, equipos) => {
                                if (err) return res.status(500).send({ mensaje: 'error en la peticion 3' });

                                if (equipos.length >= 10) {
                                    return res.status(500).send({ mensaje: 'maximo de equipos alcanzado' });
                                } else {
                                    EquipoModel.save((err, equipoguardado) => {
                                        if (err) return res.status(500).send({ mensaje: 'error en la peticion 4' });
                                        if (!equipoguardado) return res.status(500).send({ mensaje: 'no se guardó el equipo' });
                                        return res.status(200).send({ equipoguardado });
                                    });
                                }
                            });
                        } else {
                            return res.status(500).send({ mensaje: 'este equipo ya existe' });
                        }
                    });
                } else {
                    return res.status(500).send({ mensaje: 'esta liga no te pertence' });
                }

            })
        } else {
            return res.status(500).send({ mensaje: 'Enviar parametros Obligatorio' });
        }
    } else {
        if (parametros.nombre && parametros.liga) {
            Liga.findOne({ nombre: parametros.liga }, (err, LigaEncontrada) => {
                if (err) return res.status(500).send({ mensaje: 'error en la peticion1 ' });
                if (!LigaEncontrada) return res.status(500).send({ mensaje: 'no hay ligas' })
                EquipoModel.nombre = parametros.nombre;
                EquipoModel.liga = LigaEncontrada._id;
                EquipoModel.puntos = 0;
                EquipoModel.golesFavor = 0;
                EquipoModel.golesContra = 0;
                EquipoModel.diferenciaGoles = 0;
                Equipo.findOne({ nombre: parametros.nombre, liga: LigaEncontrada._id, usuario: req.user.sub }, (err, equipoEncontrado) => {
                    if (err) return res.status(500).send({ mensaje: 'error en la peticion 2' });
                    if (!equipoEncontrado) {
                        Equipo.find({ liga: LigaEncontrada._id }, (err, equipos) => {
                            if (err) return res.status(500).send({ mensaje: 'error en la peticion 3' });
                            if (equipos.length >= 10) {
                                return res.status(500).send({ mensaje: 'maximo de equipos alcanzado' });
                            } else {
                                EquipoModel.save((err, equipoguardado) => {
                                    if (err) return res.status(500).send({ mensaje: 'error en la peticion 4' });
                                    if (!equipoguardado) return res.status(500).send({ mensaje: 'no se guardó el equipo' });
                                    return res.status(200).send({ equipoguardado });
                                });
                            }
                        });
                    } else {
                        return res.status(500).send({ mensaje: 'este equipo ya existe' });
                    }
                });
            })
        } else {
            return res.status(500).send({ mensaje: 'Enviar parametros Obligatorio' });
        }
    }
}

function verEquipos(req, res) {
    var IdLiga = req.params.idLiga;
    if (req.user.rol !== 'ROL_ADMIN') {
        Liga.findOne({_id: IdLiga}, (err, LigaEncontrada) =>{
            if (err) return res.status(500).send({ mensaje: 'error en la peticion' });
            if (!LigaEncontrada) return res.status(500).send({ mensaje: 'no hay ligas' });
            if (LigaEncontrada.Usuarios == req.user.sub) {
                Equipo.find({ liga: IdLiga }, (err, EquipoEncontrado) => {
                    if (err) return res.status(500).send({ mensaje: 'error en la peticion' });
                    if (!EquipoEncontrado) return res.status(500).send({ mensaje: 'No hay Equipos' });
                    return res.status(200).send({ ligasEncontradas: EquipoEncontrado });
                });
            } else {
                return res.status(500).send({ mensaje: 'No Es tu Liga' });
            }
        })
    } else {
            Equipo.find({ liga: IdLiga }, (err, EquipoEncontradoA) => {
                if (err) return res.status(500).send({ mensaje: 'error en la peticion' });
                if (!EquipoEncontradoA) return res.status(500).send({ mensaje: 'Aún no hay ligas' });
                return res.status(200).send({ ligasEncontradas: EquipoEncontradoA });
            });
    }
}

function editarEquipo(req, res) {
    var parametros = req.body;
    var IdEquipo = req.params.idEquipo;
    if (req.user.rol !== 'ROL_ADMIN') {

        Equipo.findOne({_id: IdEquipo}, (err , equipoEncontrado)=>{
            if (err) return res.status(500).send({ mensaje: 'error en la peticion' });
            if (!equipoEncontrado) return res.status(500).send({ mensaje: 'no se encontro Equipos' });
            Liga.findOne({_id: equipoEncontrado.liga}, (err, LigaEncontrada) =>{
                if (err) return res.status(500).send({ mensaje: 'error en la peticion' });
                if (!LigaEncontrada) return res.status(500).send({ mensaje: 'no se encontro liga' });
                 
                if (req.user.sub == LigaEncontrada.Usuarios) {
                    delete parametros.liga
                    Equipo.findByIdAndUpdate(IdEquipo, parametros, { new: true }, (err, equipoActualizado) => {
                        if (err) return res.status(500).send({ mensaje: 'error en la peticion' });
                        if (!equipoActualizado) return res.status(500).send({ mensaje: 'no se pudo actualizar el equipo' });
                
                        return res.status(200).send({ equipoActualizado });
                
                    });
                } else {
                    return res.status(500).send({ mensaje: 'Este equipo no Pertenece' });
                }
            })

       
        })

    } else {

        delete parametros.liga
        Equipo.findByIdAndUpdate(IdEquipo, parametros, { new: true }, (err, equipoActualizado) => {
            if (err) return res.status(500).send({ mensaje: 'error en la peticion' });
            if (!equipoActualizado) return res.status(500).send({ mensaje: 'no se pudo actualizar el equipo' });
    
            return res.status(200).send({ equipoActualizado });
    
        });

    }


}

function eliminarEquipo(req, res) {
    var IdEquipo = req.params.idEquipo;

    Equipo.findByIdAndDelete(IdEquipo, (err, equipoEliminado) => {
        if (err) return res.status(500).send({ mensaje: 'error en la peticion' });
        if (!equipoEliminado) res.status(500).send({ mensaje: 'no se pudo eliminar el equipo' });

        return res.status(200).send({ mensaje: 'se ha eliminado el equipo' + equipoEliminado });
    });

}

function obtenerEquipo(req, res) {
    var IdEquipo = req.params.idEquipo;

    if (req.user.rol !== 'ROL_ADMIN') {
        Equipo.findOne({ _id: IdEquipo }, (err, equipoEncontrado) => {
            if (err) return res.status(500).send({ mensaje: "Error en peticion" });
            if (!equipoEncontrado) return res.status(500).send({ mensaje: "Error en peticion" });
            Liga.findOne({_id: equipoEncontrado.liga}, (err, LigaEncontrada) =>{
                if (err) return res.status(500).send({ mensaje: "Error en peticion" });
                if (!LigaEncontrada) return res.status(500).send({ mensaje: "Error en peticion" });
                if (req.user.sub == LigaEncontrada.Usuarios ) {
                    return res.status(200).send({ Equipo_registrado: equipoEncontrado });
                } else {
                    return res.status(500).send({ mensaje: 'Este equipo no te Pertenece' });
                }

            })
        })
    } else {
        Equipo.findOne({ _id: IdEquipo }, (err, equipoEncontrado) => {
            if (err) return res.status(500).send({ mensaje: "Error en peticion" });
            if (!equipoEncontrado) return res.status(500).send({ mensaje: "Error en peticion" });
            return res.status(200).send({ Equipo: equipoEncontrado });
        })
    }
}
module.exports = {
    verEquipos,
    crearEquipo,
    editarEquipo,
    eliminarEquipo,
    obtenerEquipo
}



