function pedirRecetas(){
	let url = './rest/receta/';

	fetch(url).then(function(response){
		//La peticion ha ido bien
		if(!response.ok){
			console.log('errorrrrr');
			return;
		}else{
			response.json().then(function(datos){
				console.log(datos);
				let html = '';
				datos.FILAS.forEach(function(e,idx,v){
					html +=`<li>${e.nombre}</li>`;
				});
				document.getElementById('lista-recetas').innerHTML = html;
			});
		}
	},function(response){
		//Se ha producido un error en la peticion
		console.log('Error');
	});
}

/*
	Para el registro es rest/usuario
	para el login es rest/login
*/

function hacerLogin(){
	let url = './rest/login/',
		fd 	= new FormData();

	fd.append('login','usuario2'); //Lo de login es el name del formulario
	fd.append('pwd','usuario2');
	fetch(url,{'method':'POST','body':fd}).then(function(response){

		if(response.ok){
			response.json().then(function(datos){
				console.log(datos);
				sessionStorage.setItem('usuario',JSON.stringify(datos));
			});
		}
	},function(repsonse){

	});
}

function hacerComentario(){
	let url = './rest/receta/1/comentario/',
		fd 	= new FormData();

	fd.append('l',JSON.parse(sessionStorage.getItem('usuario')).login);
	fd.append('titulo','titulos');
	fd.append('text','texto');

	fetch(url,{'method':'POST','body':fd,'headers':{'Authorization':JSON.parse(sessionStorage.getItem('usuario')).clave}}).then(function(response){
		//peticion bien

		if(response.ok){
			response.json().then(function(datos){
				console.log(datos);
			});
		}
	},function(response){

	});
}