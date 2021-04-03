// requires
var express = require('express');
const { dbConexion } = require('./db/config');
var bodyParser = require('body-parser');

// inicializar variables
var app = express();
dbConexion();
// CORS
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, x-token");
  res.header("Access-Control-Allow-Methods", "POST, GET, PUT, DELETE, OPTIONS")
  next();
});

// Parseo del body
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.json());

// importar rutas
var usuarioRoutes = require('./routes/usuario');
var loginRoutes = require('./routes/login');




// RUTAS: midderware
app.use('/usuario', usuarioRoutes);
app.use('/login', loginRoutes);
 

// escuchar peticiones
app.listen(3000, ()=>{
	console.log('express puerto 3000: \x1b[32m%s\x1b[0m', 'online');
});