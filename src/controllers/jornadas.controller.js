const Liga = require("../models/ligas.model");
const Equipo = require("../models/equipos.model");
const Usuario = require('../models/usuario.model');
const Jornada = require('../models/jornadas.model');



function crearJornada(req, res) {

    var modelJornada = new Jornada();
    var parametros = req.body;

    if (parametros.nombre && parametros.liga) {
        Liga.findOne({ nombre: parametros.liga }, (err, ligaEncontrada) => {
            if (err) return res.status(500).send({ mensaje: 'error en la peticion' });
            if (!ligaEncontrada) return res.status(500).send({ mensaje: 'no se encontro liga' });
            modelJornada.nombre = parametros.nombre;
            modelJornada.liga = ligaEncontrada._id;
            Jornada.findOne({ nombre: parametros.nombre }, (err, jornadaEncontrada) => {
                if (err) return res.status(500).send({ mensaje: 'error en la peticion' });
                if (!jornadaEncontrada) {
                    modelJornada.save((err, jornadaGuardada) => {
                        if (err) return res.status(500).send({ mensaje: 'error en la peticion' });
                        if (!jornadaGuardada) return res.status(500).send({ mensaje: 'no se guardó la jornada' });
                        return res.status(200).send({ jornadaGuardada });
                    });
                } else {
                    return res.status(500).send({ mensaje: 'esta jornada ya existe' });
                }
            });


        })

    } else {
        return res.status(500).send({ mensaje: 'no puede dejar parametros vacios' });
    }

}

function agregarResultado1(req, res) {
    var parametros = req.body;


    Equipo.findOne({ nombre: parametros.equipo }, (err, equipoEncontrado) => {
        Equipo.findOne({ nombre: parametros.equipo2}, (err, equipoEncontrado2) =>{
        if (err) return res.status(500).send({ mensaje: 'error en la peticion' });

        Equipo.find({liga: equipoEncontrado.liga}, (err, EquiposEncontrados) =>{
            console.log(EquiposEncontrados.length)
            if(EquiposEncontrados.length%2==0){
        
                console.log("El número "+ EquiposEncontrados.length +" es par");
            
            }else{
                
                console.log("El número "+ EquiposEncontrados.length +" es impar");
            }
                

        })

        const dataEquipo1 = {
            puntos: 0,
            golesFavor: 0,
            golesContra: 0,
            diferenciaGoles: 0,
        };

        const dataEquipo2 = {
            puntos: 0,
            golesFavor: 0,
            golesContra: 0,
            diferenciaGoles: 0,
        }

        dataEquipo1.puntos = parseInt(equipoEncontrado.puntos) + parseInt(1);
        dataEquipo1.golesFavor = parseInt(equipoEncontrado.golesFavor) + parseInt(parametros.golesEquipo1);
        dataEquipo1.golesContra = parseInt(equipoEncontrado.golesContra) + parseInt(parametros.golesEquipo2);
        dataEquipo1.diferenciaGoles = dataEquipo1.golesFavor - dataEquipo1.golesContra;

        dataEquipo2.puntos = parseInt(equipoEncontrado2.puntos) + parseInt(1);
        dataEquipo2.golesFavor = parseInt(equipoEncontrado2.golesFavor) + parseInt(parametros.golesEquipo1);
        dataEquipo2.golesContra =parseInt(equipoEncontrado2.golesContra ) + parseInt(parametros.golesEquipo2);
        dataEquipo2.diferenciaGoles = dataEquipo2.golesFavor - dataEquipo2.golesContra;

        console.log(equipoEncontrado.id);
        console.log(equipoEncontrado2.id)
        console.log(dataEquipo1)
        console.log(dataEquipo2)
        Equipo.findByIdAndUpdate({ _id: equipoEncontrado.id }, dataEquipo1, { new: true }, (err, equipoActualizado) => {
            Equipo.findByIdAndUpdate({ _id: equipoEncontrado2.id }, dataEquipo2, { new: true }, (err, equipoActualizado2) => {
            console.log(equipoActualizado)
            console.log(equipoActualizado2)

            Jornada.updateOne({ liga: equipoEncontrado.liga, }, {
                $push: {
                    enfrentamientos: {
                        enfrentamiento: parametros.equipo + " vs " + parametros.equipo2,
                        resultado: parametros.golesEquipo1 + " - " + parametros.golesEquipo2
                    }
                }
            }, (err, resultadoAgregada) => {

                return res.status(200).send({ resultadoAgregada });

            })


        })
        });

    })
    });
}

function agregarResultado2(req, res) {
    var params = req.body;
    var equipoModel = Equipo();

    Equipo.findOne({ nombre: params.equipo }, (err, equipoEncontrado) => {
        if (err) return res.status(500).send({ mensaje: 'error en la peticion' });

        equipoModel.nombre = equipoEncontrado.nombre;
        equipoModel.imagen = equipoEncontrado.imagen;
        equipoModel.liga = equipoEncontrado.liga;
        equipoModel.puntos = equipoEncontrado.puntos + params.golesEquipo2;
        equipoModel.golesFavor = equipoEncontrado.golesFavor + params.golesEquipo2;
        equipoModel.golesContra = equipoEncontrado.golesContra + params.equipo1;
        equipoModel.diferenciaGoles = equipoModel.golesFavor - equipoModel.golesContra;

        Equipo.findByIdAndUpdate(equipoEncontrado.id, equipoModel, { new: true }, (err, equipoActualizado) => {
            if (err) return res.status(500).send({ mensaje: 'error en la peticion' });
            if (!equipoActualizado) return res.status(500).send({ mensaje: 'no se actualizó el equipo' });

            return res.status(200).send({ equipoActualizado });
        });

    });


}

module.exports = {
    crearJornada,
    agregarResultado1,
    agregarResultado2
}