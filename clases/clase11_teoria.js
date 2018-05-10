var _ANCHO_ = 360,
    _ALTO_  = 360;

function prepararCanvas(){
	let cvs = document.querySelectorAll('canvas');

	cvs.forEach(function(e){
		e.width = _ANCHO_;
		e.height = _ALTO_;
	});

	//IMPLEMENTACION DE DRAG AND DROP
	let cv01 = document.querySelector('#cv01');
	cv01.ondragover = function(e){
		e.stopPropagation();
		e.preventDefault(); //return false
	}

	cv01.ondrop = function(e){
		e.stopPropagation();
		e.preventDefault(); //return false
		let fichero = e.dataTransfer.files[0]:
		console.log(fichero);
		let fr = new FileReader();
		//Comprobar si es una imagen

		fr.onload = function(){
			let img = new Image();

			img.onload = function{
				let ctx = cv01.getContext('2d');

				ctx.drawImage(img,0,0,cv01.width,cv01.heigth);
			};
			img.src = fr.result;
		};
		fr.readAsData(fichero);


	}
}

function prueba01(){
	let cv = document.querySelector('#cv01'),
		ctx= cv.getContext('2d');

	ctx.lineWidth = 2;
	ctx.strokeStyle = '#a00';
	ctx.strokeRect(0,0,100,75);
}

function traslacion(){
	let cv = document.querySelector('#cv01'),
		ctx= cv.getContext('2d');

	ctx.translate(20,50);	
}

function rotacion(){
	let cv = document.querySelector('#cv01'),
		ctx= cv.getContext('2d'),
		ang= 45;

	ctx.rotate(Math.PI * (ang/180));	
}

function escalado(){
	let cv = document.querySelector('#cv01'),
		ctx= cv.getContext('2d');

	ctx.scale(2,2);	
}

function limpiar(){
	let cv =document.querySelector('#cv01');

	cv.width = cv.width;
}

function imagen01(){
	let cv  = document.querySelector('#cv01'),
		ctx = cv.getContext('2d'),
		img = new Image();

	img.onload = function(){
		ctx.drawImage(img,0,0,cv.width,cv.height);
	}
	img.src='../Practica3/Images/fondo-header.jpg';
}

//La carga de imagenes es asincrona

function copiar01(){
	let cv01  = document.querySelector('#cv01'),
		ctx01 = cv01.getContext('2d'),	
		cv02 = document.querySelector('#cv02'),
		ctx02 = cv02.getContext('2d');

	ctx02.drawImage(cv01,0,0);
}


function copiar02(){
	let cv01  = document.querySelector('#cv01'),
		ctx01 = cv01.getContext('2d'),	
		cv02 = document.querySelector('#cv02'),
		ctx02 = cv02.getContext('2d');

	let imgData = ctx01.getImageData(0,0,cv01.width,cv01.heigth);

	//El putImageData tiene muchas signaturas utiles para la práctica
	ctx02.putImageData(imgData,0,0);
}

function lineas(){
	let cv = document.querySelector('#cv02'),
		ctx = cv.getContext('2d'),
		r   = 3;
		dim = cv.width / r;

	ctx.beginPath();
	ctx.lineWidth = 2;
	ctx.strokeStyle = '#a00';
	for(let i = 0; i<r; i++){
		//lineas verticales
		ctx.moveTo(i * dim,0);
		ctx.lineTo(i * dim,cv.height);


		ctx.moveTo(0,i*dim);
		ctx.lineTo(cv.width,i*dim);

	} 

	ctx.stroke();

}