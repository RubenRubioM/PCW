/*
	TO-DO

	Los directorios hacerlos absolutos.
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
	sessionStorage.removeItem("login_session");
	redireccion();
}


//Se dispara cuando clickamos en el usuario del index.html
function clickUsuario(){
	console.log('Receta de:'+event.srcElement.innerHTML+'...');
	location.href='/PCW/Practica2/buscar.html?autor='+event.srcElement.innerHTML;
}

//Se dispara cuando clickamos en el titulo de la receta en index.html
function clickReceta(){
	console.log('Receta de:'+event.srcElement.id+'...');
	location.href='/PCW/Practica2/receta.html?'+event.srcElement.id;
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
							<a href="javascript:void(0);" onclick="clickReceta();"><h3 id="${id}">${titulo}</h3></a>
							<p><a href="javascript:void(0);" onclick="clickUsuario();">${autor}</a></p>
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
		console.log(xhr.responseText);
		let r = JSON.parse(xhr.responseText);
		if(r.RESULTADO=='OK'){
			sessionStorage.setItem('usuario',xhr.responseText);
		}
	};
	xhr.send(fd);

	return false;
}

/*

	Funciones para la pagina receta.html

*/

