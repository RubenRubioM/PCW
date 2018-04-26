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

function dejarComentario(){

	if(!sessionStorage.getItem('usuario')) return false;

	let xhr = new XMLHttpRequest(),
		url = 'rest/receta/1/comentario/',
		fd  = new FormData(),
		usu = JSON.parse(sessionStorage.getItem('usuario'));

	fd.append('l',usu.login);
	fd.append('titulo','ASDASD');
	fd.append('texto', 'asdasd asdasd asdasd');

	xhr.open('POST',url,true);
	xhr.onload = function(){
		console.log(xhr.responseText);
	};
	xhr.setRequestHeader('Authorization',usu.clave);
	xhr.send(fd);
	return false;
}