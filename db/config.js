
var mongoose = require('mongoose');

// conexion a db
const dbConexion = async() =>{
    try{
        await mongoose.connect('mongodb://localhost:27017/logindb',{
            useNewUrlParser:true,
            useUnifiedTopology: true,
            useCreateIndex: true
        });
        console.log('Base de Datos logindb: \x1b[32m%s\x1b[0m', 'online');
    }catch (error){
        // detener ejecucion del servidor
        throw new Error('Error DB')
    }
}

module.exports = {
    dbConexion
}