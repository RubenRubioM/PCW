var _ANCHO_ = 360,
    _ALTO_  = 240;

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
				};
				img.src = fr.result;
			};
			fr.readAsDataURL(fichero);
			
		}

	}
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
			empezarJuego();
		};
		img.src = fr.result;
	};
	fr.readAsDataURL(e);


}

function dibujarLineas(){

	let cv = document.querySelector('#cv02'),
		ctx = cv.getContext('2d'),
		r   = 3;
		dim = cv.width / r;

	ctx.beginPath();
	ctx.lineWidth = 2;
	ctx.strokeStyle = document.getElementById('colorPicker').value;
	for(let i = 0; i<r; i++){
		//lineas verticales
		ctx.moveTo(i * dim,0);
		ctx.lineTo(i * dim,cv.height);


		ctx.moveTo(0,i*dim);
		ctx.lineTo(cv.width,i*dim);

	} 

	ctx.stroke();	

}

function empezarJuego(){
	let cv01  = document.querySelector('#cv01'),
		ctx01 = cv01.getContext('2d'),	
		cv02 = document.querySelector('#cv02'),
		ctx02 = cv02.getContext('2d');

	let imgData = ctx01.getImageData(0,0,cv01.width,cv01.height);

	//El putImageData tiene muchas signaturas utiles para la práctica
	ctx02.putImageData(imgData,0,0);
}