function anyadir(){
	//let ul = document.getElementById('hola');
	let ul = document.querySelector('#hola'),
		li;

	//Creo elemendo li
	li = document.createElement('li');
	li.innerHTML = '<a href="http://www.ua.es">UA </a>';
	//li.textContent = '<a href="http://www.ua.es">UA </a>';
	//ul.appendChild(li);
	ul.insertBefore(li, ul.firstChild);
	
}

function cambiar(){
	let ul = document.querySelector('#hola');

	ul.outerHTML = `<article>
						<h3> Titulo del articulo</h3>
						<p> lorem lorem </p>
					</article>`;
}

//Peticion con AJAX
function pedirEntradas(){

	let xhr = new XMLHttpRequest(),
		url = 'rest/receta/?u=6';

	xhr.open('GET',url, true);
	xhr.onload = function(){
		let objJSON = JSON.parse(xhr.responseText);
			div     = document.querySelector('#recetas');
		console.log(objJSON);
		document.querySelector('#recetas').innerHTML = xhr.responseText;

		div.innerHTML = '<ul>';
		objJSON.FILAS.forEach(e =>{
			div.innerHTML += `<li>${e.nombre}</li>`;
		});		

		div.innerHTML += '</ul>';
	};

	xhr.onerror = function(){
		console.log('ERROR');
	};

	xhr.send();
}

//Hacer entradas con Fetch
//Creo que he copiado y pegado mal pero es un lio lo
// de las funciones
function pedirEntradasFetch(){
	let url = 'rest/receta/?u=6';

	fetch(url).then(function(response){
		response.json().then(function(texto){
			let div = document.querySelector('#recetas');
			console.log(objJSON);
			document.querySelector('#recetas').innerHTML = xhr.responseText;

			div.innerHTML = '<ul>';
			objJSON.FILAS.forEach(e =>{
				div.innerHTML += `<li>${e.nombre}</li>`;
			});		

			div.innerHTML += '</ul>';
		};
		});
	},function(error){
		console.log('Errororororor');
	});
}