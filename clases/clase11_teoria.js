var _ANCHO_ = 360,
    _ALTO_  = 360,
		r   = 3;

function sacarFilaCol(e){
	let dim  = e.target.width/r;
	let fila = Math.floor(e.offsetY/dim);
	let col  = Math.floor(e.offsetX/dim);

	return [col,fila];
}

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
	};

	cv01.ondrop = function(e){
		e.stopPropagation();
		e.preventDefault(); //return false
		let fichero = e.dataTransfer.files[0]:
		console.log(fichero);
		let fr = new FileReader();
		//Comprobar si es una imagen

		fr.onload = function(){
			let img = new Image();

			img.onload = function(){
				let ctx = cv01.getContext('2d');

				ctx.drawImage(img,0,0,cv01.width,cv01.height);
			};
			img.src = fr.result;
		}; 
		fr.readAsDataURL(fichero);
	};

	//EVENTOS DE RATON
	let cv02 = document.querySelector('#cv02');

	cv02.onmousemove = function(e){
		let x = e.offsetX;
		let y = e.offsetY;
		let ctx01 = cv01.getContext('2d');
		let ctx02 = cv02.getContext('2d');
		let dim = cv02.width/r;
		let [col,fila] = sacarFilaCol(e);

		let imgdata    = ctx01.getImageData(col*dim,fila*dim,dim,dim);

		ctx02.putImageData(imgdata,col*dim,fila*dim,dim,dim);
		document.querySelector('#posXY').textContent = `(${x},${y})`;

		
		document.querySelector('#filaCol').textContent = `(${fila},${col})`;

		cv02.width = cv02.width;
		lineas();
	};
	cv02.onmouseenter = function(e){
		let x = e.offsetX;
		let y = e.offsetY;
		document.querySelector('#posEXY').textContent = `(${x},${y})`;
	};

	cv02.onmouseleave = function(e){
		let x = e.offsetX;
		let y = e.offsetY;
		document.querySelector('#posLXY').textContent = `(${x},${y})`;
	};

	cv02.onmousedown = function(e){
		let x = e.offsetX;
		let y = e.offsetY;
		document.querySelector('#posDXY').textContent = `(${x},${y})`;
	};

	cv02.onmouseup = function(e){
		let x = e.offsetX;
		let y = e.offsetY;
		document.querySelector('#posUXY').textContent = `(${x},${y})`;
	};

	cv02.onclick = function(e){
		let x = e.offsetX;
		let y = e.offsetY;
		document.querySelector('#posCXY').textContent = `(${x},${y})`;
		let [col,fila] = sacarFilaCol(e);
		let ctx01 = cv01.getContext('2d');
		let ctx02 = cv02.getContext('2d');
		let dim = cv02.width/r;
		let imgdata    = ctx01.getImageData(col*dim,fila*dim,dim,dim);

		ctx02.putImageData(imgdata,col*dim,fila*dim,dim,dim);
		lineas();
	};



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

function limpiar(e){
	let cv = e.target.parentNode.parentNode.querySelector('canvas');

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

function copiar03(){
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
		dim = cv.width / r;

	ctx.beginPath();
	ctx.lineWidth = 2;
	ctx.strokeStyle = '#a00';
	for(let i = 1; i<r; i++){
		//lineas verticales
		ctx.moveTo(i * dim,0);
		ctx.lineTo(i * dim,cv.height);


		ctx.moveTo(0,i*dim);
		ctx.lineTo(cv.width,i*dim);

	} 

	ctx.stroke();

}