'user strict'

var mongoose = require('mongoose');
var app = require('./app');
var port = process.env.PORT || 3977;

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost:27017/curso_mean2',(err, res)=>{
	if(err){
		throw err;
	}else{
		console.log("Conexión exitosa");
		app.listen(port, function(){
			console.log("Servidor del API Rest funciona exitosamente en http://localhost:"+port);
		});
	}
});