var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var LigaSchema = Schema({
    nombre: String,
    Usuarios: { type: Schema.Types.ObjectId, ref: 'Usuarios' }
});

module.exports = mongoose.model('ligas', LigaSchema);