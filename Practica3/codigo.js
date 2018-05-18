////////////////////////////////////////////////////////////
// Hacer la documentacion en el acerca.html              //
//////////////////////////////////////////////////////////

var _ANCHO_ = 360,
    _ALTO_  = 240,
    filas,
    columnas,
    dim,
    img,
    juego_empezado = false,
    piezas=[],
	arrayOrdenado=[],
	arrayDesordenado=[],
	segundos = 0,
	movimientos = 0;


function redireccion(){
	location.href = './index.html';
}



//Prepara el canvas y el drag&drop
function prepararCanvas(){

	let cvs = document.querySelectorAll('canvas');

	cvs.forEach(function(e){
		e.width = _ANCHO_;
		e.height = _ALTO_;
	});

	//Escribimos el texto en el canvas
	let cv01 = document.querySelector('#cv01'),
		ctx01= cv01.getContext('2d'),
		cv02 = document.querySelector('#cv02'),
		ctx02= cv01.getContext('2d');

	ctx01.textAlign = 'center';
	ctx01.font = '40px sans-serif';
	ctx01.strokeText('Click aqui',180,120);
	//IMPLEMENTACION DE DRAG AND DROP
	cv01.style.backgroundImage = 'initial';
	
	if(!juego_empezado){
		console.log('El juego comienza');
		cv01.ondragover = function(e){
			e.stopPropagation();
			e.preventDefault(); //return false
		}

		cv01.ondragenter = function(e){
			e.stopPropagation();
			e.preventDefault();
			cv01.style.backgroundImage = 'url(./Images/drag-drop-upload-1.gif)';
		}

		cv01.ondragleave = function(e){
			e.stopPropagation();
			e.preventDefault();
			cv01.style.backgroundImage = 'initial';
		}

		cv01.ondrop = function(e){
			e.stopPropagation();
			e.preventDefault(); //return false
			let fichero = e.dataTransfer.files[0],
			    fr      = new FileReader();

			//Comprobar si es una imagen
			let tipo = fichero.type;
			
			if(tipo[0]=='i' && tipo[1]=='m' && tipo[2]=='a' && tipo[3]=='g' && tipo[4]=='e'){

				console.log('Es una imagen valida...');
				fr.onload = function(){
					 img = new Image();

					img.onload = function(){
						let ctx = cv01.getContext('2d');

						ctx.drawImage(img,0,0,cv01.width,cv01.height);
						copiarImagen();
						dibujarLineas();
					};
				img.src = fr.result;
				};
			fr.readAsDataURL(fichero);
			
			}

		}


		cv02.onclick = function(e){
			let x = e.offsetX;
			let y = e.offsetY;

		}
	}else{
		console.log('El juego empezó, no puedes insertar imagenes');
		cv01.ondrop = function(e){
			e.stopPropagation();
			e.preventDefault();
		};
	}
	

}

//Para que al darle click en el canvas se abra el input[file]
function clickCanvas01(){
	let input = document.getElementById('input-archivo');

	input.click();
}

//Se llama cada vez que se selecciones una imagen en el input
function seleccionadaImagen(e){
	let cv01 = document.querySelector('#cv01');
	let fr = new FileReader();

	fr.onload = function(){
		 img = new Image();

		img.onload = function(){
			let ctx = cv01.getContext('2d');

			ctx.drawImage(img,0,0,cv01.width,cv01.height);
			dibujarLineas();

		};
		img.src = fr.result;
	};
	fr.readAsDataURL(e);


}

//Dibuja lineas
function dibujarLineas(){
	let cv    = document.querySelector('#cv02'),
		ctx   = cv.getContext('2d'),
		nivel = document.getElementById('dificultad').value;

	//Siemrpe limpiaremos el canvas antes de dibujar las lineas

	//Comprobamos si el juego esta iniciado porque si no se realizara otro metodo de borrado
	if(!juego_empezado){
		cv.width = cv.width;
		copiarImagen();
	}else{
		//El juego esta empezado
	}
	

	if(nivel=='Facil'){
		columnas = 6;
		filas    = 4;
		dim      = 60;
	}else if(nivel=='Medio'){
		columnas = 9;
		filas    = 6;
		dim      = 40;
	}else if(nivel=='Dificil'){
		columnas = 12;
		filas    = 8;
		dim      = 30;
	}

	console.log('Dificultad: '+nivel+'...');
	console.log('Se van a construir '+columnas+' columnas y '+filas+' filas...');
	ctx.beginPath();
	ctx.lineWidth = 2;
	ctx.strokeStyle = document.getElementById('colorPicker').value;

	//Dibujamos las columnas
	for(let i = 1; i<columnas; i++){
		//lineas verticales
		ctx.moveTo(i * dim,0);
		ctx.lineTo(i * dim,cv.height);
	} 

	ctx.stroke();	

	ctx.beginPath();
	ctx.lineWidth = 2;
	ctx.strokeStyle = document.getElementById('colorPicker').value;

	//Dibujamos las filas
	for(let i = 1; i<filas; i++){
		//lineas verticales
		ctx.moveTo(0,i * dim);
		ctx.lineTo(cv.width,i * dim);
	} 

	ctx.stroke();	

}

//Copia la imagen del canvas1 al canvas2
function copiarImagen(){
	let cv01  = document.querySelector('#cv01'),
		ctx01 = cv01.getContext('2d'),	
		cv02  = document.querySelector('#cv02'),
		ctx02 = cv02.getContext('2d'),
		jugar = document.getElementById('jugar');

	jugar.disabled = false;

	let imgData = ctx01.getImageData(0,0,cv01.width,cv01.height);

	//El putImageData tiene muchas signaturas utiles para la práctica
	ctx02.putImageData(imgData,0,0);

}

//Se llama al darle click en jugar e inicia el cronometro
function iniciarJuego(){
	document.getElementById('jugar').disabled = true;
	document.getElementById('finalizar').disabled = false;
	document.getElementById('ayuda').disabled = false;
	document.getElementById('colorPicker').disabled = true;
	document.getElementById('dificultad').disabled = true;
	document.getElementById('Segundos').style.display = 'block';
	document.getElementById('movimientos').style.display = 'block';
	document.getElementById('errores').style.display = 'block';
	document.getElementById('input-archivo').disabled = true;


	juego_empezado=true;
	desordenarPiezas();
	control = setInterval(cronometro,1000);
	document.getElementById('errores').innerHTML='Errores: '+numeroErrores();
	document.getElementById('movimientos').innerHTML='Movimientos: '+movimientos;


}

//Se llama cuando le das al boton de finalizar juego
function finalizarJuego(){
	let contenedorGlobal = document.getElementById('contenedor-global');
	let mensajeFinal     = document.getElementById('mensaje-modal');

	//Asignamos los valores a los outputs
	document.getElementById('out-piezas').innerHTML=numeroErrores();
	document.getElementById('out-movimientos').innerHTML=movimientos;
	document.getElementById('out-segundos').innerHTML=segundos;

	mensajeFinal.style.display = 'block';


}


function ayuda(){

	let cv01 = document.querySelector('#cv01'),
		ctx01= cv01.getContext('2d'),
		cv02 = document.querySelector('#cv02'),
		ctx02= cv01.getContext('2d');

	for(let i=0;i<arrayOrdenado.length;i++){
		if(arrayOrdenado[i]==arrayDesordenado[i]){
			//Esta bien puesta
		}else{
			//Esta mal puesta
		}
	}
}

function reiniciarJuego(){
	document.getElementById('contenedor-global').style.display = 'block';
	document.getElementById('mensaje-modal').style.display = 'none';
	let cv01  = document.querySelector('#cv01'),
		cv02  = document.querySelector('#cv02'),
		jugar = document.getElementById('jugar').disabled=true,
		finalizar = document.getElementById('finalizar').disabled=true,
		ayuda = document.getElementById('ayuda').disabled=true,
		colorPicker = document.getElementById('colorPicker').disabled=false,
		dificultad = document.getElementById('dificultad').disabled=false,
		input = document.getElementById('input-archivo').disabled=false,
		segundos = document.getElementById('Segundos').style.display='none',
		movimientos2 = document.getElementById('movimientos').style.display='none',
		errores = document.getElementById('errores').style.display='none';

	reinicioReloj();
	juego_empezado=false;
	movimientos=0;
	segundos=0;
	prepararCanvas();
		
}
//Vamos a ir comparando los valores de los dos arrays
function numeroErrores(){
	var errores=0;
	for(let i=0;i<arrayOrdenado.length;i++){
		if(arrayOrdenado[i]!=arrayDesordenado[i]){
			errores++;
		}
	}
	return errores;
}

function desordenarPiezas(){
	for(let i=0;i<filas*columnas;i++){
		arrayOrdenado[i]=i;

	}
	arrayDesordenado=desordenarArray();

	pintarCanvasDesordenado();
}


function desordenarArray(){
	var a = [];
	for(let i=0;i<arrayOrdenado.length;i++){
		a[i]=arrayOrdenado[i];
	}
	
    for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
    }

    
    return a;
}

function pintarCanvasDesordenado(){
	var cv01  = document.querySelector('#cv01'),
		ctx01 = cv01.getContext('2d'),	
		cv02  = document.querySelector('#cv02'),
		ctx02 = cv02.getContext('2d');

	var i,
		pieza,
		xpos = 0,
		ypos = 0;

	//Al array piezas le voy asignando cada posicion un objeto con la posicion X e Y de esos sitios, por ejemplo en la posicion (1,1) = (60,60)
	for(i=0;i<filas*columnas;i++){
		pieza = {};
		pieza.sx = xpos;
		pieza.sy = ypos;

		piezas.push(pieza);
		xpos+=dim;
		if(xpos>=cv02.width){
			xpos=0;
			ypos+=dim;
		}
	}

	cv02.width =cv02.width;
	for(let i=0;i<arrayDesordenado.length;i++){
		let imgdata    = ctx01.getImageData(piezas[arrayDesordenado[i]].sx,piezas[arrayDesordenado[i]].sy,dim,dim);


		ctx02.putImageData(imgdata,piezas[arrayOrdenado[i]].sx,piezas[arrayOrdenado[i]].sy);

		console.log('Imagen colocada en '+arrayDesordenado[i]+' ('+piezas[arrayDesordenado[i]].sx+','+piezas[arrayDesordenado[i]].sy+')');

	}

	dibujarLineas();
}


function reinicioReloj() {
	clearInterval(control);
	segundos = 0;
}

function cronometro () {
	segundos++;
	Segundos.innerHTML = segundos+"s";
}


