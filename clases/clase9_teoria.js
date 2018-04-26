function pintarRect01(){
	let cv = document.querySelector('body>canvas'),
		ctx = cv.getContext('2d');

	ctx.fillStyle = '#a00';
	ctx.fillRect(10,10, 100, 60);

	ctx.lineWidth = 2;
	ctx.strokeStyle = '#a00';
	ctx.fillStyle = '#0a0';
	ctx.fillRect(50,100, 50, 100);
	ctx.strokeRect(50,100, 50, 100);

	ctx.fillStyle = 'rgba(200,200,0,0.5)';
	ctx.fillRect(10,80, 100, 60);

	ctx.shadowOffsetX = 5;
	ctx.shadowOffsetY = 5;
	ctx.shadowColor = '#000';
	ctx.shadowBlur = 10;
	ctx.fillStyle = '#a00';
	ctx.fillRect(10,200, 100, 60);

}

function prepararCanvas(){
	let cv = document.querySelector('body>canvas');

	cv.width = 480;
	cv.height = 360;

}

//Utilizar grosores pares para evitar que se vea borroso