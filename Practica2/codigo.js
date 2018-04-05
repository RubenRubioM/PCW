/*

Funciones globales

*/

function comprobar_storage()
{
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

function arranque()
{
	comp=comprobar_storage();
	if(comp)
	{
		//comprobamos si esta logueado o no
		if(sessionStorage.getItem("login_session"))
		{
			//si esta logueado
			
			var elementos = document.querySelectorAll('body>nav>ul>li>a>span');

			for(var i=0; i<elementos.length;i++){
				if(elementos[i].innerHTML=='Login' || elementos[i].innerHTML=='Registro'){
					elementos[i].parentNode.parentNode.remove();
				}
			}
		}
		else
		{
			//no esta logueado
			var elementos = document.querySelectorAll('body>nav>ul>li>a>span');

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



function cerrar()
{
	sessionStorage.removeItem("login_session");
	redireccion();
}




/*

Funciones para el index.html

*/

var paginas_totales; //Total de paginas que tendra el index
var pagina_actual = 1; //Pagina del index en la que estamos
var recetas; //archivo JSON con todas las recetas
var receta_imprimir = 0; //Receta del array que vamos a imprimir
var recetas_en_pagina = 0; //Recetas que se estan mostrando actualmente

//Pedimos todas las recetas al servidor
function peticionRecetasIndex(){
	var obj = new XMLHttpRequest(),
		url = 'rest/receta/';
	
	obj.open('GET',url,true);
	obj.onload = function(){
		recetas = JSON.parse(obj.responseText);
		crearRecetasIndex();
		Modificar_botonera_Index();
		console.log(recetas);
		
	};

	obj.onerror = function(){
		console.log('ERROR');
	};

	
	obj.send();
	

}

//Creamos los nodos donde van a ir las recetas
function crearRecetasIndex(){
	let div = document.querySelector('#contenedor-todas-las-recetas');
	
	for(var i = 0; i<6;i++){

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
				fecha		= recetas.FILAS[receta_imprimir].fecha;
			
			//Creamos el nodo de la receta
			var tarjeta = document.createElement('div');
			tarjeta.innerHTML =
			 `<div class="contenedor-recetas">
					<section>
						<header>
							<a href="receta.html"><h3>${titulo}</h3></a>
							<p><a href="buscar.html">By ${autor}</a></p>
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
			
			div.appendChild(tarjeta); //Añadimos la receta al contenedor
			console.log('Añadida receta nº '+ (receta_imprimir+1));
			recetas_en_pagina++;
			receta_imprimir++; //Aumentamos el apuntador al array de recetas

		}else{
			console.log('break');
			break;
		}
		
	}
}

//Modifica el numero actual de pagina de la botonera del index
function Modificar_botonera_Index(){
	paginas_totales = Math.ceil(recetas.FILAS.length/6);
	let botonera = document.querySelector('#contenedor-recetas-navegacion>p>span');
	
	botonera.innerHTML = `${pagina_actual}/${paginas_totales}`;	
}

//Nos lleva a la primera pagina del index
function primeraPagina(){
	if(pagina_actual!=1){
		receta_imprimir=0;
		pagina_actual = 1;
		borrar_recetas_index();
		crearRecetasIndex();
		Modificar_botonera_Index();
	}
}

//Atrasa una pagina en el index
function boton_atras(){
	if(pagina_actual>1){
		
		receta_imprimir = receta_imprimir-(recetas_en_pagina + 6);
		console.log(receta_imprimir);
		borrar_recetas_index();		
		pagina_actual--;
		crearRecetasIndex();
		Modificar_botonera_Index();
	}
}

//Avanza una pagina en el index
function boton_adelante(){
	if(pagina_actual<paginas_totales){
		borrar_recetas_index();
		pagina_actual++;
		crearRecetasIndex();
		Modificar_botonera_Index();
	}
}

//Nos lleva a la ultima pagina del index
function ultimaPagina(){
	if(pagina_actual!=paginas_totales){
		pagina_actual=paginas_totales;
		borrar_recetas_index();
		receta_imprimir= ((paginas_totales-1)*6);
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
	console.log('Todas las recetas han sido borradas');
}

/*

Funciones para la pagina buscar.html

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
			comensales	 = document.getElementById("comensales"),
			dificultad	 = document.getElementById("dificultad"),
			autor 		 = document.getElementById("autor"),
			elaboracion	 = document.getElementById("elaboracion");

		
		for(var i=0; i<argumentos.length; i++){

			//extraemos el prefijo (t,,n,i,e,a,d,c,di,df)

			let tipo_y_parametro = argumentos[i].split('=');

			//Titulo y elaboracion
			if(tipo_y_parametro[0]=='t'){
				console.log('Argumentos de tipo T...');
				titulo = tipo_y_parametro[1];
				elaboracion = tipo_y_parametro[1];
			}
			
			//Titulo
			if(tipo_y_parametro[0]=='n'){
				console.log('Argumentos de tipo E...');
				titulo = tipo_y_parametro[1];
			}
		}
	}else{
		console.log('No existe ningun argumento...');
		peticionRecetasIndex();
	}
}

function realizarBusqueda(){
	let titulo 		 = document.getElementById("nombre").value,
		ingredientes = document.getElementById("ingredientes").value,
		comensales	 = document.getElementById("comensales").value,
		dificultad	 = document.getElementById("dificultad").value,
		autor 		 = document.getElementById("autor").value,
		elaboracion	 = document.getElementById("elaboracion").value;

	console.log(titulo + ingredientes + comensales + dificultad + autor + elaboracion);
}