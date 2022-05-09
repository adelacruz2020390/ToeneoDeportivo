var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var JornadaSchema = Schema({
    nombre: String,
    liga: { type: Schema.Types.ObjectId, ref: 'ligas' },
    enfrentamientos: [{
        enfrentamiento: String,
        resultado: String
    }]
});

module.exports = mongoose.model('jornadas', JornadaSchema);