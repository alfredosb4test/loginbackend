 // requires
var express = require('express'); 
const { check } = require('express-validator');
const { validarCampos } = require('../middlewares/validar-campos');
var bcrypt = require('bcrypt');
var jwt = require('jsonwebtoken'); 
var SEED = require('../config/config').SEED;
var mdAutenticacion = require('../middlewares/autenticacion');

// inicializar variables
var app = express();

var Usuario = require('../models/usuario');
app.post('/test', (req, res, next) => {
	return res.status(200).json({
		ok: true, 
		msg: 'usuarios ok'
	});
});
// ================================================
// Todos los usuarios
// ================================================
app.get('/', mdAutenticacion.verificaToken, (req, res, next) => {

	var desde = req.query.desde || 0;
	desde = Number(desde);

	Usuario.find({}, 'nombre email img role')
		.skip(desde)
		.limit(5)
		.exec( 
			(err, usuarios)=>{
			if(err){
				return res.status(500).json({
					ok: false,
					mensaje: "Error cargando usuarios",
					errors: err
				});
			}
			
			Usuario.countDocuments({}, (err, conteo)=>{
				
				res.status(200).json({
					ok: true,
					total: conteo,
					usuarios: usuarios,
					mensaje: 'peticion GET usuarios'
				});

			})
		});		
});

// ================================================
// Crear un Registro
// ================================================
app.post('/',
	[
		check('nombre', 'El nombre es obligatorio').not().isEmpty(),
		check('password', 'El password es obligatorio').not().isEmpty(),
		check('email', 'El email es obligatorio').isEmail(),
		validarCampos
	], 
	async(req, res) => {
		var body = req.body;
		
		email = body.email ;
		existeEmail = await Usuario.findOne({ email });

		if(existeEmail){
			return res.status(400).json({
				ok: false,
				mensaje: "El email ya existe"
			});
		}

		var usuario = new Usuario({
			nombre: body.nombre,
			email : body.email,
			password : bcrypt.hashSync(body.password, 10),
			img : body.img,
			role : body.role
		});

		usuario.save( (err, UsuarioGuardado) =>{
			if(err){
				return res.status(400).json({
					ok: false,
					mensaje: "Error al crear usuario",
					errors: err
				});
			}
			var token = jwt.sign({ usuario: UsuarioGuardado }, SEED, { expiresIn: 14400 } );
			res.status(201).json({
				ok: true,
				usuario: UsuarioGuardado,
				token
			})
		});
	
});

module.exports = app;