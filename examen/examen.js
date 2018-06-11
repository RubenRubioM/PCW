var combinaciones;
var hayGris = false;
var intentos=0;
function empezar(){
	document.getElementById("enviar").disabled=false;
	document.getElementById("empezar").disabled=true;
	

	url = './rest/combinacion/nueva/'
	var obj = new XMLHttpRequest();

	console.log(url);

	obj.open('GET',url,true);
	obj.onload = function(){
		combinaciones = JSON.parse(obj.responseText);
		
		if(combinaciones.RESULTADO=='OK'){
			habilitarCombinaciones();


			sessionStorage.setItem('login_session',obj.responseText);

		}
		
	};

	obj.onerror = function(){
		console.log('ERROR');
	};

	
	obj.send();
	

}

function habilitarCombinaciones(){
	var colores = document.querySelector('#combinaciones');

	colores.onclick = function(e){
		var ultimoSlash = e.target.src.lastIndexOf('/');
		var id 			= e.target.src.substring(ultimoSlash+6);

		if(id=='0.svg'){
			e.target.src = 'imgs/ficha1.svg';

		}else if(id=='1.svg'){
			e.target.src = 'imgs/ficha2.svg';
		}else if(id=='2.svg'){
			e.target.src = 'imgs/ficha3.svg';
			
		}else if(id=='3.svg'){
			e.target.src = 'imgs/ficha4.svg';
			
		}else if(id=='4.svg'){
			e.target.src = 'imgs/ficha5.svg';
			
		}else if(id=='5.svg'){
			e.target.src = 'imgs/ficha6.svg';
			
		}else if(id=='6.svg'){
			e.target.src = 'imgs/ficha0.svg';
			
		}
	}

}


function enviar(){
	//comprobamos que no hayan grises
	hayGris=false;
	var colores = document.querySelectorAll('.seleccionables');

	colores.forEach(function(e){
		var ultimoSlash = e.src.lastIndexOf('/');
		var id 			= e.src.substring(ultimoSlash+6);
		
		
		if(id=='0.svg'){
			hayGris=true;
		}
	});

	if(hayGris==false){
		//Se puede realizar la peticion
		var codigo='';

		colores.forEach(function(e){
			var ultimoSlash = e.src.lastIndexOf('/');
			var id 			= e.src.substring(ultimoSlash+6);
			if(id=='1.svg'){
				codigo += 1;
			}else if(id=='2.svg'){
				codigo += 2;
				
			}else if(id=='3.svg'){
				codigo += 3;
				
			}else if(id=='4.svg'){
				codigo += 4;
				
			}else if(id=='5.svg'){
				codigo += 5;
				
			}else if(id=='6.svg'){
				codigo += 6;
				
			}
		});
	}else{
		console.log('Debes seleccionar todos los colores');
		return;
	}


	enviarCodigo(codigo);
}

function enviarCodigo(codigo){
	var obj = new XMLHttpRequest();
	var url = './rest/combinacion/comprobar/'+codigo;
	var usu = JSON.parse(sessionStorage.getItem('login_session'));
	console.log(url);
	var respuesta;
	obj.open('GET',url,true);
	obj.onload = function(){
		respuesta = JSON.parse(obj.responseText);
		
		if(respuesta.RESULTADO=='OK'){
			intentos++;
			dibujarPeticion(respuesta);
			codigoBlanco();
			
			
			if(respuesta.ACIERTOS.EL==4){
				//GANADOR
				mostrarCodigoOculto(respuesta);
			}

		}
		
	};

	obj.onerror = function(){
		console.log('ERROR');
	};

	obj.setRequestHeader('Authorization',usu.clave);
	obj.send();
}


function dibujarPeticion(respuesta){
	var div = document.getElementById('combinaciones');

	div.innerHTML += `<img  src="imgs/ficha${respuesta.COMBINACION[0]}.svg">
	<img  src="imgs/ficha${respuesta.COMBINACION[1]}.svg">
	<img  src="imgs/ficha${respuesta.COMBINACION[2]}.svg">
	<img  src="imgs/ficha${respuesta.COMBINACION[3]}.svg">
		<p>{"EL":${respuesta.ACIERTOS.EL},"FL":${respuesta.ACIERTOS.FL}</p>`;
}

function codigoBlanco(){
	var colores = document.querySelectorAll('.seleccionables');

	colores.forEach(function(e){

		
		e.src='imgs/ficha0.svg';

	});
}

function mostrarCodigoOculto(respuesta){
	var ocultos =document.querySelectorAll('#codigo-oculto>img');
	var cont = 0;
	ocultos.forEach(function(e){

		e.src=`imgs/ficha${respuesta.COMBINACION[cont]}.svg`;
		cont++;

	});

	eliminarCombinacion();
}

function eliminarCombinacion(){
	var url = './rest/combinacion/'
	var obj = new XMLHttpRequest();
	var usu = JSON.parse(sessionStorage.getItem('login_session'));
	console.log(url);

	obj.open('DELETE',url,true);
	obj.onload = function(){
		var respuesta = JSON.parse(obj.responseText);
		
		if(respuesta.RESULTADO=='OK'){
			sessionStorage.removeItem("login_session");
			mostrarModal();

		}
		
	};

	obj.onerror = function(){
		console.log('ERROR');
	};

	obj.setRequestHeader('Authorization',usu.clave);
	obj.send();
}


function mostrarModal(){
	var div = document.getElementById('mensaje-modal');
	var parrafo = document.getElementById('parrafo');
	div.display=block;

	parrafo.innerHTML = `Has averiguado la combinacion en ${intentos} intentos`;
}

function recargar(){
	location.href = location.href;
}