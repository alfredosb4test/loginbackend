var mongoose = require('mongoose');
var uniqueValidator = require('mongoose-unique-validator');

var Schema = mongoose.Schema;

var rolesValidos = {
	values: ['ADMIN_ROLE', 'USER_ROLE'],
	message: '{VALUE} no es un rol permitido'
}

var usuarioSchema = new Schema({
	nombre: { type: String, required: [true, 'El nombre es requerido']},
	email: { type: String, unique: true, required: [true, 'El correo es requerido']},
	password: { type: String, required: [true, 'El pwd es requerido']},
	img: { type: String, required: false},
	role: { type: String, required: false, default: 'USER_ROLE', enum: rolesValidos}

});


usuarioSchema.plugin( uniqueValidator, { message: '{PATH} debe de ser unico' } );
// cambiar el campo _id por uid
usuarioSchema.method('toJSON', function(){
	const {__v, _id, ...object} = this.toObject();
	object.uid = _id;
	return object;
})

module.exports = mongoose.model('usuario', usuarioSchema);