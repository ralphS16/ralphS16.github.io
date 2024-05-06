const videos = [
	'INh4O_1Um_A',
	'Ca7AFf1CWv4',
	'B1J6Ou4q8vE',
	'6P81crAOSAo',
	'ZYj4NkeGPdM',
	'6VZlWIW5ZdM',
	'NFz686OXG_c',
	'dMekskqXbL4',
	'YmKvSHkquho',
	'jGpwCRLni3M',
	'sloEhrxG7N4',
	'3AjnafqDK-c',
	'njU37AjslG4',
	'lHJxZ7JOEwI',
	'xkID7m4Kzf8',
	'ChnarChSc60',
	'WqpEQWRcQcw',
	'J8x-xoDeJsQ',
	'6CCUPUo-E_M',
	'8OzZxjqKG10',
	'ATObNI_H09A',
	'3SasNsK7DNY',
	'd2YJza2w-4Q',
	'0SPZ_kewSY4',
	'eqJFVg05b8Q',
	'uqAZnHSWxK8',
	'myO8fxhDRW0',
	'b-IEVMwBEfo',
	'MoS8CmLP4go',
	'hF14kFP19PM',
	'sxnX5_LbBDU',
	'jUibsIUxcg0',
	'T0YeE50sAvQ',
	'KjmRoVZKx6U',
	'7l5giVFNKbc',
	'BzWqGNe5Cwo',
	'JL-MiACXUCE',
	'D8rTrie70qU',
	'cx06NdqME0I',
	'u41ujNodvnM',
	'VpvqoYUybyA',
	'JdxkVQy7QLM',
	'aMJyZnkQKDA',
	'ExYz1Ar5eas',
	'cExJbbwOfcw',
	'Y2hWi0fo97M',
	'4faabCcz9q8',
	'I9zs5_c6kHI',
	'Jcghl0lbDSk',
	'02djlsjk0Y8',
	'dwWq1NYAaLk',
	'_c1NJQ0UP_Q',
	'ACwDY1arLL0',
	'BipvGD-LCjU',
	'NJXvoNK_PK4',
	'UkXy12xVnRs',
	'Ngi4XHFytGY',
	'1s4zSXYbFDU',
	'CAkAMSBL4ps',
	'cNz0feswke4',
	'5lUBlW72qBQ',
	'jz5lA0kXG1s',
	'Yik7c0EXV0M',
	'sMKoNBRZM1M',
	'OQW5Zms6Y5E',
	'iRThyHhhTdg',
	'cknUxBJPE88',
	'VMD8ZHAkk3I',
	'BJtChhpMYn8',
	'qZxBqIUlduc',
	'blcKeLDDzSM',
	'o54sGWJd8tg',
	'SIZdSPM0So8',
	'izbzvEksKhY',
	'NPsPX9XScag',
	'c6T6suvnhco',
	'x9RKbJNBbG4',
	'wgQdkstTNg8',
	'HQMefVlBi9o',
	'b42GY8mLBxA',
	'M_wvL0wiWRw',
	'fktzwbXmd9g',
	'ne6tB2KiZuk',
	'FqtcNyKg_o4'
];

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
	window.location.hash = '#'+e.target.id;
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

function randomVideo(){
	var i = parseInt(Math.random() * videos.length);
	url = videos[i];
	window.open('https://www.youtube.com/watch?v='+url, '_blank').focus();
}