function loadscript() { //this is the function for onload
	// start by binding the generation of the grid to the change of dimension
	document.getElementById("diminput").onchange = generateGrid;
	generateGrid();
}

function generateGrid() { // this is the function to draw the grid
	let dimension = document.getElementById("diminput").value; //this is the number of cells per side
	gridElement = document.getElementById("grid"); // find the grid
	gridElement.innerHTML = ""; // erase everything in the grid

	// create the rows and add them to the grid
	for (let i = 1; i <= dimension; i++) {
		let row = document.createElement("div"); //div element for the row
		row.classList.add("grid-row"); // class of the row

		// create the cells and add them to each row
		for (let j = 1; j <= dimension; j++) {
			let cell = document.createElement("div"); // div element for the cell
			cell.classList.add("grid-cell"); //class of the cell

			//define the position by converting 2D coordinates  to 1D -> from (i,j) to position
			cell.textContent = (i - 1) * dimension + j; // the position is the number when the grid is ordered
			cell.title = ((i - 1) * dimension + j); //the title contains the position of the cell
			cell.classList.add("unselectable"); // cells should not be selectable
			cell.addEventListener("click", swap); // onclick, swap the cell
			if (i == dimension && j == dimension) {
				cell.classList.add("empty");
			} // if it is last cell, hide it
			cell.style.width = cell.style.height = Math.floor(625 / dimension) + "px"; // define the size of the cells

			row.appendChild(cell);
		}

		gridElement.appendChild(row);
	}
	thatMix(); //mix the grid
}

function swap(comp) {
	// swaps the cell if it can be swapped
	let dimension = document.getElementById("diminput").value;
	let cellElement = this; // this contains the element that was clicked
	let position = +cellElement.title; // find the 1D coordinate and convert it to 2D -> position = [x,y]
	let x = (position - 1) % dimension; // column
	let y = Math.ceil(position / dimension) - 1; // row

	// around = [left cell, right cell, up cell, down cell]
	let around = [// these values are assigned only of cells are not on the edge
		x - 1 >= 0 ? [x - 1, y] : undefined,
		x + 1 < dimension ? [x + 1, y] : undefined,
		y - 1 >= 0 ? [x, y - 1] : undefined,
		y + 1 < dimension ? [x, y + 1] : undefined,
	];

	// for each cell around
	for (let i = 0; i < 4; i++) {
		if (pos = around[i]) { // if the cell is not undefined
			//find the element at the 1D position converted from 2D of the around cell
			let elementPosition = (pos[1] * dimension + pos[0] + 1)
			let aroundCellElement = document.querySelector("[title=\"" + elementPosition.toString() + "\"]");
			// if this element is the empty cell
			if (aroundCellElement.classList.contains("empty")) {
				// swap it with the clicked cell
				[cellElement.textContent, aroundCellElement.textContent] = [aroundCellElement.textContent, cellElement.textContent]; //the number in the cell
				cellElement.classList.add("empty"); // move the cells
				aroundCellElement.classList.remove("empty");
				if (comp != 1 && solved()) { // if the swap was performed by the user and the board is solved
					alert("The board is solved");
				}
			}
		}
	}
}

function swapper(pos1, pos2) {
	// this function swaps two cells on the board with each other
	let cell1 = document.querySelector("[title=\"" + pos1.toString() + "\"]");
	let cell2 = document.querySelector("[title=\"" + pos2.toString() + "\"]");

	//switcht the text content of the two cells
	[cell1.textContent, cell2.textContent] = [cell2.textContent, cell1.textContent]; //the number in the cell
	
	// if one of the cell is empty switch them
	if (cell1.classList.contains("empty")) { 
		cell2.classList.add("empty");
		cell1.classList.remove("empty");
	} else if (cell2.classList.contains("empty")) {
		cell1.classList.add("empty");
		cell2.classList.remove("empty");
	}
	if (cell1 == cell2) {
		console.log(pos1,pos2);
	}
}

function thatMix() {
	//Fisher-Yates shuffle on the grid
	let dim = document.getElementById("diminput").value;
	let swaps = dim*dim;
	
	while (swaps > 1) {
		randPos = Math.floor(Math.random() * --swaps)+1;
		swapper(randPos, swaps+1, dim); 
	}
	if (!solvable()){
		//switcht the text content of the two cells before the last one since they will change
		// the inversion number only by one and make the board solvable
		
		cells = Array.from(document.getElementsByClassName("grid-cell"))
					.filter(function (cell) {return cell.textContent == (dim*dim - 1) || cell.textContent == (dim*dim - 2);});
		
		let [cell1,cell2] = cells;
		[cell1.textContent, cell2.textContent] = [cell2.textContent, cell1.textContent];

	}
	if (!solvable()){ console.log(false);} // if the board is not solvable log false (impossible)
}

function solved() {
	//verifies if the board is solved if all the cells have the same position as their number, it is solved
	let gridCells = Array.from(document.getElementsByClassName("grid-cell"));
	if (gridCells.some(function (cell) {return cell.title != cell.textContent;})) {
		return false;
	} else {
		return true;
	}
}

function countInversions(gridArray) {
	// grid Array is of the form [1,2,3,4,...]
	// this function counts and returns the number of inversions in the array
	let sums = 0;
	for (let i = 0; i < gridArray.length; i++) {
		// adds the number of numbers lower than the number at position i in the array
		sums += gridArray.slice(i+1)
						.filter(function(el) {return el < gridArray[i];})
						.length;
	}
	return sums;
}

function solvable() {
	// analyze the board to see if it is solvable with the
	// inversion polarity method
	let dim = document.getElementById("diminput").value;
	
	// transforom the gridCells into an array of the numbers sorted by position
	let gridCells = Array.from(document.getElementsByClassName("grid-cell"))
	let gridArray = gridCells.sort(function(a,b) {return a.title-b.title;})
							.map(function(el) {return +el.textContent;}); 
	
	let rowPosBlank = dim+1-Math.floor(gridArray.indexOf(dim*dim)/ dim)+1; // row of the blank from the bottom
	//count Inversions in the grid
	gridArray.splice(gridArray.indexOf(dim*dim),1);
	let nInv = countInversions(gridArray);
	
	// odd dim => nInv must be event
	// even dim => blank on odd row from bottom => nInv must be even
	// 			=> blank on even row from bottom => nInv must be odd
	if (dim % 2 === 0) {
		if (rowPosBlank % 2 === 0) {
			return !(nInv%2 === 0);
		} else {
			return (nInv%2 === 0);
		}
	} else {
		return (nInv%2 === 0);
	}
}

window.addEventListener("load", loadscript);

/*function mix() {
	// mixes the board by swapping until each entry is different.
	let dimension = document.getElementById("diminput").value;
	while (!mixed()) {
		index = Math.floor(Math.random() * dimension * dimension);
		swap.call(document.getElementsByClassName("grid-cell")[index], 1); //swap with this equal to a random cell
	}
}

function mixed() {
	//verifies if the board is mixed, if a cell is at the same position as its number, board is not mixed
	let gridCells = Array.from(document.getElementsByClassName("grid-cell"));
	if (gridCells.some(function (cell) {return cell.title == cell.textContent;})) {
		return false;
	} else {
		return true;
	}
}*/
