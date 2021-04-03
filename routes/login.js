 // requires
var express = require('express'); 
const { check } = require('express-validator');
const { validarCampos } = require('../middlewares/validar-campos');
var bcrypt = require('bcrypt');
var jwt = require('jsonwebtoken');
var SEED = require('../config/config').SEED;
// inicializar variables
var app = express();

var Usuario = require('../models/usuario');
 

var mdAutentificacion =  require('../middlewares/autenticacion')


app.get('/test', (req, res) => {
	return res.status(200).json({
		ok: true, 
		msg: 'ruta login ok'
	});
});


app.get('/renuevatoken', mdAutentificacion.verificaToken, (req, res) => {
	var token = jwt.sign({ usuario: req.usuario }, SEED, { expiresIn: 14400 } ); // 14400 = 4 HORAS

	return res.status(200).json({
		ok: true, 
		token: token
	});
});
 

// ================================================
// Autentificacion
// ================================================
app.post('/',
	[
		check('password', 'password es obligatorio').not().isEmpty(),
		check('email', 'email es obligatorio').isEmail(),
		validarCampos
	], 
	(req, res) => {
		var body = req.body;

		Usuario.findOne( { email: body.email }, (err, usuarioDB) =>{
			if(err){
				return res.status(500).json({
					ok: false,
					mensaje: "Error al buscar usuario",
					errors: err
				});
			}
			if(!usuarioDB){
				return res.status(400).json({
					ok: false,
					mensaje: "Error al buscar usuario - email",
					errors: { message: 'No existe usuario con ese email' }
				});			
			}
			if( !bcrypt.compareSync( body.password, usuarioDB.password) ){
				return res.status(400).json({
					ok: false,
					mensaje: 'Credenciales incorrectas password',
					errors: err
				});		
			}

			// crear token!
			usuarioDB.password = '*';
			// firmar (payload, SEED o semilla, fecha de expiracion
			var token = jwt.sign({ usuario: usuarioDB }, SEED, { expiresIn: 14400 } ); // 14400 = 4 HORAS
			res.status(200).json({
				ok: true,
				usuario: usuarioDB,
				token: token,
				id: usuarioDB._id
			});
		});	
	
});

module.exports = app;