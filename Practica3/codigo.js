////////////////////////////////////////////////////////////
// Hacer la documentacion en el acerca.html              //
//////////////////////////////////////////////////////////

var _ANCHO_ = 360,
    _ALTO_  = 240;

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
		ctx01= cv01.getContext('2d');

	ctx01.textAlign = 'center';
	ctx01.font = '40px sans-serif';
	ctx01.strokeText('Click aqui',180,120);
	//IMPLEMENTACION DE DRAG AND DROP
	
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
		console.log('Sale');
		cv01.style.backgroundImage = 'none';
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
				let img = new Image();

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
		let img = new Image();

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
		nivel = document.getElementById('dificultad').value,
		columnas,
		filas,
		dim;

	//Siemrpe limpiaremos el canvas antes de dibujar las lineas
	cv.width = cv.width;
	copiarImagen();

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

	console.log('Se van a construir '+columnas+' columnas y '+filas+' filas...');
	ctx.beginPath();
	ctx.lineWidth = 2;
	ctx.strokeStyle = document.getElementById('colorPicker').value;

	//Dibujamos las columnas
	for(let i = 0; i<columnas; i++){
		//lineas verticales
		ctx.moveTo(i * dim,0);
		ctx.lineTo(i * dim,cv.height);
	} 

	ctx.stroke();	

	ctx.beginPath();
	ctx.lineWidth = 2;
	ctx.strokeStyle = document.getElementById('colorPicker').value;

	//Dibujamos las filas
	for(let i = 0; i<filas; i++){
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
	control = setInterval(cronometro,10);
}

var centesimas = 0;
var segundos = 0;
var minutos = 0;
var horas = 0;

function reinicio () {
	clearInterval(control);
	centesimas = 0;
	segundos = 0;
	minutos = 0;
	horas = 0;
	Centesimas.innerHTML = ":00";
	Segundos.innerHTML = ":00";
	Minutos.innerHTML = ":00";
	Horas.innerHTML = "00";
}

function cronometro () {
	if (centesimas < 99) {
		centesimas++;
		if (centesimas < 10) { centesimas = "0"+centesimas }
		Centesimas.innerHTML = ":"+centesimas;
	}
	if (centesimas == 99) {
		centesimas = -1;
	}
	if (centesimas == 0) {
		segundos ++;
		if (segundos < 10) { segundos = "0"+segundos }
		Segundos.innerHTML = ":"+segundos;
	}
	if (segundos == 59) {
		segundos = -1;
	}
	if ( (centesimas == 0)&&(segundos == 0) ) {
		minutos++;
		if (minutos < 10) { minutos = "0"+minutos }
		Minutos.innerHTML = ":"+minutos;
	}
	if (minutos == 59) {
		minutos = -1;
	}
	if ( (centesimas == 0)&&(segundos == 0)&&(minutos == 0) ) {
		horas ++;
		if (horas < 10) { horas = "0"+horas }
		Horas.innerHTML = horas;
	}
}