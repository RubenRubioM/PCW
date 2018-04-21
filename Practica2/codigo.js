/*
	TO-DO


	1. Modificar con css el mensaje emergente del login y registro

	2. En el index y buscar hacer un metodo para ordenar las recetas por fecha

	3. Hacer el nueva-receta
*/

/*

Variables globales

*/
var paginas_totales; //Total de paginas que tendra el index
var pagina_actual = 1; //Pagina del index en la que estamos
var recetas; //archivo JSON con todas las recetas
var receta_imprimir = 0; //Receta del array que vamos a imprimir
var recetas_en_pagina = 0; //Recetas que se estan mostrando actualmente
const recetas_por_pagina = 6; //Recetas a mostrar por pagina
var fotos_receta; //Array de fotos de la receta
var foto_mostrar = 0; //Foto del array que vamos a mostrar
var nfotos; //Numero de fotos de la receta

/*

Funciones globales

*/

//Pedimos las recetas y las montamos en index y buscar
function peticionRecetas(url){
	var obj = new XMLHttpRequest();
	
	obj.open('GET',url,true);
	obj.onload = function(){
		recetas = JSON.parse(obj.responseText);
		crearRecetasIndex();
		let texto_numero_resultados = document.getElementById('total-busqueda');
		if(texto_numero_resultados!=null){
			texto_numero_resultados.innerHTML = 'Numero total de recetas encontradas: '+recetas.FILAS.length;
		}
		
		Modificar_botonera_Index();		
	};

	obj.onerror = function(){
		console.log('ERROR');
	};

	
	obj.send();
}


function comprobar_storage(){

	if(typeof(Storage)!=="undefined")
	{
		console.log("session storage compatible");
		return true;
	}
	else
	{
		console.warn("session storage no compatible");
		alert("su navegador no es compatible con esta funcion\npor favor actualice su navegador");
		return false;

	}
}


function arranque(){

	comp=comprobar_storage();
	if(comp)
	{
		//comprobamos si esta logueado o no
		if(sessionStorage.getItem("login_session"))
		{

			//Esta logeado
			console.log('El usuario esta logeado...');
			var url 		= location.href,
				ultimoSlash = url.lastIndexOf('/'),
				resultado 	= url.substring(ultimoSlash+1);
			//Si estamos intenando entrar a login o registro desde la url estando ya logeado
			if(resultado=='login.html' || resultado=='registro.html'){
				location.href = '/PCW/Practica2/index.html';
			}
			

			var elementos = document.querySelectorAll('#menu>ul>li>a>span');

			for(var i=0; i<elementos.length;i++){
				if(elementos[i].innerHTML=='Login' || elementos[i].innerHTML=='Registro'){
					elementos[i].parentNode.parentNode.remove();
				}
			}
		}
		else
		{
			//no esta logueado
			console.log('El usuario NO esta logeado...');
			var url 		= location.href,
				ultimoSlash = url.lastIndexOf('/'),
				resultado 	= url.substring(ultimoSlash+1);
			//Si intentamos entrar a nueva receta
			if(resultado=='nueva-receta.html'){
				location.href = '/PCW/Practica2/index.html';
			}
			var elementos = document.querySelectorAll('#menu>ul>li>a>span');

			for(var i=0; i<elementos.length;i++){
				if(elementos[i].innerHTML=='Nueva receta' || elementos[i].innerHTML=='Logout'){
					elementos[i].parentNode.parentNode.remove();
				}
			}
		}
		
	}
	else
	{
		//Aqui meteremos un mensaje por defecto que salga si el navegador no es compatible
	}
}


function cerrar(){
	console.log('entra');
	sessionStorage.removeItem("login_session");
	setTimeout("redireccion()",2*1000); //cuando pasan 2 segundos se redirecciona al index
}

function redireccion(){
	document.location.href="index.html";
}


/*

Funciones para el index.html

*/



//Creamos los nodos donde van a ir las recetas
function crearRecetasIndex(){
	let div = document.querySelector('#contenedor-todas-las-recetas');
	
	for(var i = 0; i<recetas_por_pagina;i++){

		//la receta a imprimir no se pasa de las totales
		if(receta_imprimir<recetas.FILAS.length){

				//Asignamos los datos del JSON a variables
			let titulo 		= recetas.FILAS[receta_imprimir].nombre,
				autor 		= recetas.FILAS[receta_imprimir].autor,
				comentarios = recetas.FILAS[receta_imprimir].comentarios,
				likes 		= recetas.FILAS[receta_imprimir].positivos,
				dislikes	= recetas.FILAS[receta_imprimir].negativos,
				foto		= recetas.FILAS[receta_imprimir].fichero,
				desc_foto	= recetas.FILAS[receta_imprimir].descripcion_foto,
				fecha		= recetas.FILAS[receta_imprimir].fecha,
				id 			= recetas.FILAS[receta_imprimir].id;
			
			//Creamos la tarjeta
			var tarjeta = 
				`<div class="contenedor-recetas">
					<section>
						<header>
							<a href="receta.html?${id}" title="${titulo}"><h3>${titulo}</h3></a>
							<p><a href="buscar.html?autor=${autor}">${autor}</a></p>
							<p>
								<span class="icon-comment boton-comentario" >${comentarios}</span>
								<span class="icon-thumbs-up-alt boton-like" >${likes}</span>
								<span class="icon-thumbs-down-alt boton-dislike">${dislikes}</span>
							</p>
						</header>
						<img src="fotos/${foto}" alt="${desc_foto}">
						<footer>
							<p><time datetime="${fecha}">${fecha}</time></p>
						</footer>
					</section>
				</div>`;

			div.innerHTML += tarjeta;
			console.log('Añadida receta nº '+ (receta_imprimir+1));
			recetas_en_pagina++;
			receta_imprimir++; //Aumentamos el apuntador al array de recetas

		}else{
			
			break;
		}
		
	}
}

//Modifica el numero actual de pagina de la botonera del index
function Modificar_botonera_Index(){
	paginas_totales = Math.ceil(recetas.FILAS.length/recetas_por_pagina);
	let botonera = document.querySelector('#contenedor-recetas-navegacion>p>span');
	
	botonera.innerHTML = `${pagina_actual}/${paginas_totales}`;	
}

//Nos lleva a la primera pagina del index
function primeraPagina(){
	if(pagina_actual!=1){
		receta_imprimir=0;
		pagina_actual = 1;
		console.log('Moviendonos a la página '+pagina_actual+"...");
		borrar_recetas_index();
		crearRecetasIndex();
		Modificar_botonera_Index();
	}
}

//Atrasa una pagina en el index
function boton_atras(){
	if(pagina_actual>1){
		
		receta_imprimir = receta_imprimir-(recetas_en_pagina + recetas_por_pagina);
		
		borrar_recetas_index();		
		pagina_actual--;
		console.log('Moviendonos a la página '+pagina_actual+"...");
		crearRecetasIndex();
		Modificar_botonera_Index();
	}
}

//Avanza una pagina en el index
function boton_adelante(){
	if(pagina_actual<paginas_totales){
		borrar_recetas_index();
		pagina_actual++;
		console.log('Moviendonos a la página '+pagina_actual+"...");
		crearRecetasIndex();
		Modificar_botonera_Index();
	}
}

//Nos lleva a la ultima pagina del index
function ultimaPagina(){
	if(pagina_actual!=paginas_totales){
		pagina_actual=paginas_totales;
		console.log('Moviendonos a la página '+pagina_actual+"...");
		borrar_recetas_index();
		receta_imprimir= ((paginas_totales-1)*recetas_por_pagina);
		crearRecetasIndex();
		Modificar_botonera_Index();
	}
}

//Borra todas las recetas que hay en el index
function borrar_recetas_index(){
	let div = document.querySelector('#contenedor-todas-las-recetas');

	while(div.hasChildNodes()){
		div.removeChild(div.firstChild);
	}
	recetas_en_pagina = 0;
	console.log('Todas las recetas han sido borradas...');
}


function busquedaRapidaIndex(){
	let parametros = document.querySelector('#contenedor-buscador-recetas>p>input').value;
	console.log(parametros);

	location.href='/PCW/Practica2/buscar.html?t='+parametros;
}
/*

Funciones para la pagina buscar.html

*/


/*  Esta funcion se llama en el onload de buscar.html

	Esta funcion lee la url y autorellena los campos del formulario.

	Cuando viene de un submit la url viene con los prefijos del formulario
	(nombre,descripcion,ingredientes,comensales,dificultad,autor y elaboracion). 

	Con lo cual cuando lleguemos aqui mediante el Index.html le enviaremos una url tal que ('?nombre=autor').
*/

/*
	
	El evento onsubmit lo que hace es recargar la página agregando a la url los parametros tal que el tag name seguido del valor

	<input id="nombre" type="text" name="nombre" placeholder="nombre de la receta">

	nombre=valor&

*/

function rellenarCamposBusqueda(){
	console.log('Comprobamos si tenemos parametros en la URL...');
	var url = document.location.href;

	if(url.indexOf('?') > 0){
		console.log('Existen argumentos...');
		var cadena_argumentos = url.split('?')[1];
		var argumentos = cadena_argumentos.split('&');//Aqui guardamos todos 													los parametros
		
		//Rellenamos los campos de la busqueda
		var titulo 		 = document.getElementById("nombre"),
			ingredientes = document.getElementById("ingredientes"),
			descripcion  = document.getElementById("descripcion"),
			comensales	 = document.getElementById("comensales"),
			dificultad	 = document.getElementById("dificultad"),
			autor 		 = document.getElementById("autor"),
			tiempo_elaboracion	 = document.getElementById("elaboracion");

		var url_peticion = './rest/receta/?';
		for(var i=0; i<argumentos.length; i++){

			//extraemos el prefijo (t,,n,i,e,a,d,c,di,df)

			let tipo_y_parametro = argumentos[i].split('=');
			
			//Titulo y elaboracion
			if(tipo_y_parametro[0]=='t'){
				
				titulo.value = tipo_y_parametro[1];
				descripcion.value = tipo_y_parametro[1];
				url_peticion += 't='+tipo_y_parametro[1];

			}
			
			//Titulo
			if(tipo_y_parametro[0]=='nombre' && tipo_y_parametro[1]!=""){
				
				titulo.value = tipo_y_parametro[1];
				url_peticion += 'n='+tipo_y_parametro[1]+'&';
			}

			//Ingrediente
			if(tipo_y_parametro[0]=='ingredientes' && tipo_y_parametro[1]!=""){

				ingredientes.value = tipo_y_parametro[1];
				url_peticion += 'i='+tipo_y_parametro[1]+'&';
			}

			//Descripcion
			if(tipo_y_parametro[0]=='descripcion' && tipo_y_parametro[1]!=""){
				descripcion.value = tipo_y_parametro[1];
				url_peticion += 'e='+tipo_y_parametro[1]+'&';
			}

			//Autor
			if(tipo_y_parametro[0]=='autor' && tipo_y_parametro[1]!=""){
				autor.value = tipo_y_parametro[1];
				url_peticion += 'a='+tipo_y_parametro[1]+'&';
			}

			//Dificultad
			if(tipo_y_parametro[0]=='dificultad' && tipo_y_parametro[1]!=""){
				dificultad.value = tipo_y_parametro[1];
				url_peticion += 'd='+tipo_y_parametro[1]+'&';
			}

			//Numero de comensales
			if(tipo_y_parametro[0]=='comensales' && tipo_y_parametro[1]!=""){
				comensales.value = tipo_y_parametro[1];
				url_peticion += 'c='+tipo_y_parametro[1]+'&';
			}

			//Minutos
			if(tipo_y_parametro[0]=='tiempo' && tipo_y_parametro[1]!=""){
				tiempo_elaboracion.value = tipo_y_parametro[1];
				url_peticion +='di='+tipo_y_parametro[1]+'&df='+tipo_y_parametro[1]+'&';
			}


		}
		//Acaba el for
		peticionRecetas(url_peticion);
	}else{
		console.log('No existe ningun argumento...');
		peticionRecetas('rest/receta/');
	}
}

/*

Funciones para la pagina login.html

*/

function hacerLogin(frm){
	let xhr = new XMLHttpRequest(),
		url = 'rest/login/',
		fd  = new FormData(frm);

	
	xhr.open('POST',url,true);
	xhr.onload = function(){
		
		let r = JSON.parse(xhr.responseText);
		
		if(r.RESULTADO=='OK'){
			//Login correcto
			console.log('Login realizado con éxito...');
			sessionStorage.setItem('login_session',xhr.responseText);
			redireccion();

		}else{
			//Algo fallo en el login, debemos mostrar el error
			console.log('Error en el login...');

			

			let div = document.getElementById("contenedor-global-login"),
				error = document.getElementById("errorLogin");
			div.style.display="none";
			error.style.display="block";
		}
	};
	xhr.send(fd);

	return false;
}

function aceptarErrorLogin(){
	let div = document.getElementById("contenedor-global-login"),
				error = document.getElementById("errorLogin");
	div.style.display="block";
	error.style.display="none";
}

/*

	Funciones para la pagina receta.html

*/

/*
	
	Lo que he hecho aquí ha sido ir pidiendo en cascada los determinados datos necesarios dado que debido al asincrono es la manera mas segura. Una vez tenemos todos los datos realizamos el formateo.

*/
//Comenzamos una cascada de peticiones para todo lo que necesitamos en la receta
function inicializarReceta(){
	//Separamos la url para conseguir la id al final
	var url 		= location.href,
		ultimoSlash = url.lastIndexOf('?'),
		id 			= url.substring(ultimoSlash+1);
		 		
	var obj = new XMLHttpRequest(),
		peticion = './rest/receta/'+id;
	
	obj.open('GET',peticion,true);
	obj.onload = function(){
		var receta = JSON.parse(obj.responseText);
		if(receta.RESULTADO=='OK'){
			peticionComentarios(id,receta);
		}
		
	};

	obj.onerror = function(){
		console.log('ERROR');
	};

	
	obj.send();
}

//Pedimos los comentarios
function peticionComentarios(id,receta){
	var obj = new XMLHttpRequest(),
		peticion = './rest/receta/'+id+'/comentarios';
	
	obj.open('GET',peticion,true);
	obj.onload = function(){
		var comentarios = JSON.parse(obj.responseText);
		if(comentarios.RESULTADO=='OK'){
			peticionIngredientes(id,receta,comentarios);
		}
		
	};

	obj.onerror = function(){
		console.log('ERROR');
	};

	
	obj.send();
}

//Pedimos los ingredientes
function peticionIngredientes(id,receta,comentarios){
	var obj = new XMLHttpRequest(),
		peticion = './rest/receta/'+id+'/ingredientes';
	
	obj.open('GET',peticion,true);
	obj.onload = function(){
		var ingredientes = JSON.parse(obj.responseText);
		if(ingredientes.RESULTADO=='OK'){
			pedirFotos(id,receta,comentarios,ingredientes)
			
		}
		
	};

	obj.onerror = function(){
		console.log('ERROR');
	};

	
	obj.send();
}

//Pedimos las fotos
function pedirFotos(id,receta,comentarios,ingredientes){
	var obj = new XMLHttpRequest(),
		peticion = './rest/receta/'+id+'/fotos';
	
	obj.open('GET',peticion,true);
	obj.onload = function(){
		fotos = JSON.parse(obj.responseText);
		if(fotos.RESULTADO=='OK'){
			formatearReceta(receta,comentarios,ingredientes);
		}
		
	};

	obj.onerror = function(){
		console.log('ERROR');
	};

	
	obj.send();
}

//Montamos la receta
function formatearReceta(receta,comentarios_json,ingredientes_json){
	console.log('Pedida la receta nº '+receta.FILAS[0].id);

	
	//Asignamos los datos del JSON a variables
	let nombre 		= receta.FILAS[0].nombre,
		autor 		= receta.FILAS[0].autor,
		comentarios = receta.FILAS[0].comentarios,
		likes 		= receta.FILAS[0].positivos,
		dislikes	= receta.FILAS[0].negativos,
		desc_foto	= receta.FILAS[0].descripcion_foto,
		fecha		= receta.FILAS[0].fecha,
		id 			= receta.FILAS[0].id,
		comensales	= receta.FILAS[0].comensales,
		tiempo		= receta.FILAS[0].tiempo,
		dificultad	= receta.FILAS[0].dificultad,	
		elaboracion = receta.FILAS[0].elaboracion;

	//Esto son variables globales ya definidas
	
	nfotos			= receta.FILAS[0].nfotos;
	
	
	var div = document.getElementById('contenedor-todas-las-recetas-receta');
	var tarjeta = `<div class="contenedor-recetas-receta">
				<section>
					<header>
						<h3>${nombre}</h3>
						<p>
							<span class="icon-user" id="numero-comensales">${comensales}</span>

							<span id="numero-preparacion">&#9200; ${tiempo}</span>

							<span id="numero-dificultad">🌟 ${dificultad}</span>
						</p>
						<p><a href="buscar.html?autor=${autor}">By ${autor}</a></p>
						<p>
							<button><span class="icon-comment boton-comentario">${comentarios}</span></button>

							<button onclick="darLike();"><span class="icon-thumbs-up-alt boton-like">${likes}</span></button>

							<button onclick="darDislike();"><span class="icon-thumbs-down-alt boton-dislike">${dislikes}</span></button>

							
						</p>
					</header>
					<p>${elaboracion}</p>
					<!-- Ingredientes -->
					<ul>
					`;

	//Indexamos los ingredientes en una lista
	for(var i=0;i<ingredientes_json.FILAS.length;i++){
		tarjeta += `<li>${ingredientes_json.FILAS[i].nombre}</li>`
	}
	tarjeta += '</ul>';
	
	//Indexamos el resto hasta comentarios
	tarjeta += `<div>
					<img src="fotos/${fotos.FILAS[foto_mostrar].fichero}" alt="${fotos.FILAS[foto_mostrar].texto}"><br>
					<span>${fotos.FILAS[foto_mostrar].texto}</span><br>
					<button onclick="anteriorFoto();"><span class="icon-left-big"></span></button>
					<button onclick="siguienteFoto();"><span class="icon-right-big"></span></button>
				</div>
					
				<footer>
					<p><time datetime="${fecha}">${fecha}</time></p>
				</footer>
				
				<span id="ultimos-comentarios">Ultimos comentarios</span>

				<!-- Zona de comentarios -->
				`;

	//Indexamos los comentarios
	tarjeta += `<div class="contenedor-receta-comentarios">`;

	for(var i=0;i<comentarios_json.FILAS.length;i++){
		tarjeta += `<div class="contenedor-receta-comentarios">
						<h3>${comentarios_json.FILAS[i].titulo}</h3>
						<p class="subtitulo-comentario-receta">
							<span class="icon-user"></span>
							<span>${comentarios_json.FILAS[i].autor},</span>
							<span><time datetime="${comentarios_json.FILAS[i].fecha}">${comentarios_json.FILAS[i].fecha}</time></span>
						</p>
						<p class="comentario-receta">${comentarios_json.FILAS[i].texto} </p>
					</div>`
	}

	//Comprobamos si el usuario esta logeado o si no
	if(sessionStorage.getItem('login_session')){
		var user = JSON.parse(sessionStorage.getItem('login_session')).nombre;
	}else{
		user = '';
	}

	//Por ultimo indexamos la zona de comentarios

	var currentdate = new Date(); 
    var datetime = currentdate.getFullYear() + '-'
    			 + currentdate.getDate() + '-'
    			 + (currentdate.getMonth()+1) + ' '
    			 + currentdate.getHours() + ':'
    			 + currentdate.getMinutes() + ':'
    			 + currentdate.getMilliseconds();
	
	tarjeta += `<div id="contenedor-introducir-comentario">
					<h3>Deje su opinión</h3>
					<p class="subtitulo-comentario-receta">
						<span class="icon-user"></span>
						<span>${user},</span>
						<span><time datetime="${datetime}">${datetime}</time></span>
					</p>
					<form onsubmit="return dejarComentario(this);">
						<p>
							TITULO:
							<input type="text" name="titulo" maxlength="50" pattern="[a-zA-Z0-9]{1,49}$" title="minimo 1 caracter y maximo 50" required>
						</p>
					
						<textarea name="texto" required></textarea>
						<input type="submit" value="Enviar comentario">
					</form>
					
				</div>`;
	div.innerHTML = tarjeta;


	comprobarCajaComentarios();

}

//Comprobamos si el usuario esta logeado para eliminar o no la caja de comentarios
function comprobarCajaComentarios(){
	//Si el usuario no esta logeado eliminamos la parte de introducir comentarios
	if(!sessionStorage.getItem('login_session')){
		var caja = document.getElementById('contenedor-introducir-comentario');
		caja.style.display = "none";
	}
}

//Funcion al darle al submit de enviar comentario
function dejarComentario(frm){

	//Separamos la url para conseguir la id al final
	var url 		= location.href,
		ultimoSlash = url.lastIndexOf('?'),
		id 			= url.substring(ultimoSlash+1);

	let xhr = new XMLHttpRequest(),
		peticion = './rest/receta/'+id+'/comentario/',
		fd  = new FormData(frm),
		usu = JSON.parse(sessionStorage.getItem('login_session'));

	fd.append('l',usu.login);
	
	xhr.open('POST',peticion,true);
	xhr.onload = function(){
		let r = JSON.parse(xhr.responseText);
		console.log(r.RESULTADO);
	};
	xhr.setRequestHeader('Authorization',usu.clave);

	xhr.send(fd);
	return false;
}

//El usuario da like a una receta
function darLike(){
	enviarVoto(1);
}

//El usuario da dislike a una receta
function darDislike(){
	enviarVoto(0);
}


function enviarVoto(valor){
	//Separamos la url para conseguir la id al final
	var url 		= location.href,
		ultimoSlash = url.lastIndexOf('?'),
		id 			= url.substring(ultimoSlash+1);

	//Valor sera 1 (positivo) o 0 (negativo)
	let xhr = new XMLHttpRequest(),
		peticion = './rest/receta/'+id+'/voto/'+valor,
		fd  = new FormData(),
		usu = JSON.parse(sessionStorage.getItem('login_session'));

	fd.append('l',usu.login);
	
	xhr.open('POST',peticion,true);
	xhr.onload = function(){
		let r = JSON.parse(xhr.responseText);
		if(r.RESULTADO=='OK'){
			if(valor==1){
				console.log('Se ha contabilizado tu voto positivo :)');
			}else{
				console.log('Se ha contabilizado tu voto negativo :(');

			}
		}
	};
	xhr.setRequestHeader('Authorization',usu.clave);

	xhr.send(fd);
	return false
}

function anteriorFoto(){
	//No es la primera foto
	if(foto_mostrar>0 && nfotos>1){
		foto_mostrar--;
		inicializarReceta();
	}

}

function siguienteFoto(){
	//No es la ultima foto
	if(foto_mostrar<nfotos-1 && nfotos>1){
		foto_mostrar++;
		inicializarReceta();
	}
}


/*

	Funciones para la pagina nueva-receta.html

*/

//Añadimos un ingrediente a la lista
function nuevoIngrediente(){
	let ingrediente = document.getElementById('texto-ingrediente').value,
		lista 		= document.querySelector('#lista-ingredientes');

	if(ingrediente!=''){
		lista.innerHTML += `<li>${ingrediente}</li>`;
	}
	
}

//Introducimos la plantilla de una nueva foto
function nuevaFoto(){
	let div = document.getElementById('contenedor-todas-las-imagenes');

	div.innerHTML += `<div class="contenedor-imagen">
						<picture>
							<img src="Images/receta-vegana.jpg" alt="receta-vegana"> 
							
						</picture>
						<input type="text" placeholder="Información de la imagen" maxlength="50"></textarea>
						<p><input type="file" value="Seleccionar foto">
						<button onclick="eliminarFoto(this);" type="button" value="Eliminar foto">Eliminar foto</button></p>

						</div>`;
}

function eliminarFoto(e){
	let div = e.parentNode.parentNode;
	
	document.removeChild(div);
	
}

function enviarReceta(frm){
	let titulo 	   = document.getElementById('nombre-receta').value,
		comensales = document.getElementById('numero-comensales').value,
		tiempo 	   = document.getElementById('tiempo-elaboracion').value,
		dificultad = document.getElementById('dificultad').value,
		texto 	   = document.getElementById('texto-elaboracion').value;

	console.log(titulo);
	console.log(comensales);
	console.log(tiempo);
	console.log(dificultad);
	console.log(texto);
	console.log(frm);



}


/*

	Funciones para la pagina registro.html

*/

//Peticion POST para hacer el registro

var password_igual=false;

function hacerRegistro(frm){

	if(password_igual){
		let xhr = new XMLHttpRequest(),
		peticion = './rest/usuario/',
		fd  = new FormData(frm);
	
		xhr.open('POST',peticion,true);
		xhr.onload = function(){
			let r = JSON.parse(xhr.responseText);
			if(r.RESULTADO=='OK'){
				//Registro con exito
				let div = document.getElementById('contenedor-global-registro');
				div.style.display='none';

				let div2 = document.getElementById('registroCorrecto');
				div2.style.display='block';
			}else{
				//Registro fallido
				console.log('Error en el registro...');
			}
		};
		xhr.setRequestHeader('Authorization',usu.clave);

		xhr.send(fd);
		return false;
	}
	
}

//Se llama cada vez que pulsamos una tecla en el nombre de usuario
function comprobarUsuario(){
	var nombre = document.getElementById('usu').value,
		url    = './rest/login/'+nombre,
		obj    = new XMLHttpRequest();

	if(nombre!=''){
		obj.open('GET',url,true);
		obj.onload = function(){
			var r = JSON.parse(obj.responseText);
			
			
			if(r.DISPONIBLE==true){
				//Esta disponible ese usuario
				
				var mensaje = document.getElementById('usuario-existente');
				mensaje.style.display = 'none';
			}else{
				//NO esta disponible ese usuario
				console.log('Usuario NO disponible :(');

				var mensaje = document.getElementById('usuario-existente');
				mensaje.style.display = 'block';
			}
		};

		obj.onerror = function(){
			console.log('ERROR');
		};

		
		obj.send();
	}else{
		let mensaje = document.getElementById('usuario-existente');
		mensaje.style.display = 'none';
	}
	
}

//Se llama cada vez que pulsamos una tecla en la confimacion de la contraseña
function comprobarPassword(){
	let psw  = document.getElementById('psw').value,
		psw2 = document.getElementById('psw2').value,
		div  = document.getElementById('password-diferente');

	if(psw2!=''){
		if(psw!=psw2){
			div.style.display = 'block';
			password_igual = false;
		}else{
			div.style.display = 'none';
			password_igual = true;
		}
	}
	
}

function aceptarRegistro(){
	location.href='login.html';
}