var jwt = require('jsonwebtoken');
var SEED = require('../config/config').SEED;

// ================================================
// Verificar TOKEN
// ================================================
exports.verificaToken = function(req, res, next){
	var token = req.header('x-token');
	
	jwt.verify( token, SEED, (err, decoded )=>{
		if(err){
			return res.status(401).json({
				ok: false,
				mensaje: "Token incorrecto",
				errors: err
			});
		}

		// decoded contiene la informacion del usuario q esta logeado
		req.usuario = decoded.usuario;
		next();
/*		res.status(401).json({
				ok: false,
				decoded: decoded
		}); */
	});
}

// ================================================
// Verificar Admin
// ================================================
exports.verificaADMIN_ROLE = function(req, res, next){
	var usuario = req.usuario;

	if( usuario.role === 'ADMIN_ROLE'){
		next();
		return;
	}else{
		return res.status(401).json({
			ok: false,
			mensaje: "Token incorrecto - no es Administrador",
			errors: { message: 'No tiene permisos' }
		});
	}
 
}
 
// ================================================
// Verificar Admin o mismo USR
// ================================================
exports.verificaADMIN_mismoUsr = function(req, res, next){
	var usuario = req.usuario;
	var id = req.query.id;

	if( usuario.role === 'ADMIN_ROLE' || usuario._id === id ){
		next();
		return;
	}else{
		return res.status(401).json({
			ok: false,
			mensaje: "Token incorrecto - no es Administrador ni mismo usuario",
			errors: { message: 'No tiene permisos' }
		});
	}
 
}
 