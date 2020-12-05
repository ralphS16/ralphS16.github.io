function openProject(e){
	card = document.getElementById(e.target.id+'-card');
	if (card.style.display == 'table-row'){
		card.style.display = 'none';
	} else {
		for (let proj of document.getElementsByClassName('project-card')){
			proj.style.display = 'none';
		}
		card.style.display = 'table-row';
	}
}
window.onload = function(){
	for (let proj of document.getElementsByClassName('project-title')){
		proj.addEventListener('click', openProject,false);
	}
	let hash = window.location.hash.substring(1);
	if (hash) {
		document.getElementById(window.location.hash.substring(1)+"-card").style.display = 'table-row';
		window.location.hash = '#'+hash;
	}	
}