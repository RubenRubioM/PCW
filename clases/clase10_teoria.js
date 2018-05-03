var _ANCHO_ = 480,
	_ALTO_  = 360;

function prepararCanvas(){
	let cv = document.querySelector('#cv01');

	cv.width  = _ANCHO_;
	cv.height = _ALTO_;

	cambiarColorStroke();
	cambiarLineWidth();
	cambiarColorRelleno();
}

function dibujarRect01(){
	let cv = document.querySelector('#cv01');
	let ctx = cv.getContext('2d');
	let x = document.querySelector('#x').value;
	let y = document.querySelector('#y').value;

	//ctx.lineWidth = 2;
	//ctx.strokeStyle = '#a00';
	//ctx.strokeStyle = document.querySelector('#stk-color').value;

	ctx.strokeRect(x,y,100,60);
}

function rellenarRect01(){
	let cv = document.querySelector('#cv01');
	let ctx = cv.getContext('2d');
	let x = document.querySelector('#x').value;
	let y = document.querySelector('#y').value;
	
	
	//ctx.fillStyle = '#0a0';
	//ctx.fillStyle = document.getElementById('fill-color').value;
	ctx.fillRect(x,y,100,60);

}

function cambiarColorStroke(){
	let cv = document.querySelector('#cv01');
	let ctx = cv.getContext('2d');

	ctx.strokeStyle = document.querySelector('#stk-color').value;

}

function cambiarColorRelleno(){
	let cv = document.querySelector('#cv01');
	let ctx = cv.getContext('2d');

	ctx.fillStyle = document.querySelector('#fill-color').value;
	
}

function cambiarLineWidth(){
	let cv = document.querySelector('#cv01');
	let ctx = cv.getContext('2d');

	ctx.lineWidth = document.getElementById('lw');
	
	
}

function pintarTexto(){
	let cv = document.querySelector('#cv01');
	let ctx = cv.getContext('2d');
	let x = document.querySelector('#x').value;
	let y = document.querySelector('#y').value;
	
	ctx.font = '32px Arial bold';
	ctx.textBaseline = 'middle';
	ctx.textAlign = 'center';
	ctx.strokeText('Buenos dias',cv.width/2,cv.height/2);
	


}

function dibujarLinea(){
	let cv = document.querySelector('#cv01');
	let ctx = cv.getContext('2d');

	ctx.beginPath();
	ctx.fillStyle = '#00a';
	ctx.strokeStyle = '#aa0';
	ctx.moveTo(100,100);
	ctx.lineTo(160,100);
	ctx.lineTo(160,170);
	ctx.lineTo(75,150);
	ctx.fill();
	ctx.closePath();
	ctx.stroke();


	ctx.beginPath();
	ctx.strokeStyle = '#a00';

	ctx.rect(10,10,60,30);

	ctx.stroke();
}

function limpiar(){
	let cv = document.querySelector('#cv01');
	let ctx = cv.getContext('2d');

	//ctx.clearRect(0,0,cv.width,cv.height);

	cv.width = cv.width;
	//Cuando le cambiamos una dimension al canvas automaticamente se resetea TODO
}

