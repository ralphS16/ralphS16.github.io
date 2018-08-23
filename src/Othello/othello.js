// This is the code for the game Othello
const COLORS = ["black-piece", "white-piece", "green-piece", "darkgreen-piece"];

function Game(board, label) {	
	this.board = board;
	this.pieces = [];
	this.turn = 1; // black player start but nextTurn is called first
	this.possibles = [];
	this.labelPts = label;
	this.passed = 0; // number of turn passed, this is for testWinner
	
	let self = this;
	
	this.nextTurn = function() {
		for (let i = 0; i < self.possibles.length; i++) {
			self.possibles[i].setPossible(false);
		}
		self.possibles = [];
		
		self.turn = 1 - self.turn;
		
		//display the points
		let label = ["Black: " + self.nPieces[0], "White: " + self.nPieces[1]] ;
		label[self.turn] = "<b>" + label[self.turn] + "</b>";
		self.labelPts.innerHTML =  label[0] + " | " + label[1];
		
		self.possibles = self.getPossibles();
		self.testWinner();
	}
	
	this.getPossibles = function() {                       
		// find all possible moves
		let possibles = [];
		// find all pieces of the current player
		let currPieces = self.pieces
											.reduce(function (all, next) {return all.concat(next)}, [])
											.filter(function(el) {return el.color === self.turn});
		for (let i = 0; i < currPieces.length; i++) {
			let {row, col} = currPieces[i];
			 // coeffs that analyse all around
			for (let hori = -1; hori <= 1; hori++) { // horizontal coefficients
				for (let vert = -1; vert <= 1; vert++) { // vertical coefficients
					if (vert === 0 && hori === 0) continue;// this config only analyse currPieces[i]
					
					let reached = false;
					let flipped = [];
					for (let j = 1; reached === false; j++) {
						let [nRow, nLine] = [row + hori * j, col + vert * j];
						if (nRow >= 8 || nRow < 0 || nLine >= 8 || nLine  < 0) break; // make sure there are no out of bounds, pieces[9][2] will catch an erro bc pieces[9] is undefined (not an array) 
						
						let betweenPiece = self.pieces[nRow][nLine]; //it's a piece between a piece of the turn color and maybe another piece
						
						//betweenPiece.element.classList.add("red"); -> ******* For debugging
						
						if (betweenPiece.color === 1 - self.turn) { // if it is of the other color, add it to the flipped pieces
							flipped.push(betweenPiece);
						} else if (j > 1 && betweenPiece.color > 1) { // if we already have at least 1 piece between and this piece is empty or already possible
							if (betweenPiece.color === 2) { // if it is empty, set it to possible
								betweenPiece.setPossible(true);
								betweenPiece.flipped = flipped; // make the array of the flipped pieces when it is clicked
								possibles.push(betweenPiece);
							} else {
								betweenPiece.flipped = betweenPiece.flipped.concat(flipped); // add to the array of flipped pieces the pieces that were found with this iteration
							}
							reached = true;
						} else { // else, break the for loop
							reached = true; // if the piece is out of bounds 
						}
						
						//betweenPiece.element.classList.remove("red"); -> ******* For debugging
					}
				}
			}
		}
		return possibles;
	}
	
	this.testWinner = function() {
		// verifies if there is a winner in the game
		if (self.possibles.length === 0) {
			if (self.passed === 0) {
				self.passed = 1;
				return self.nextTurn();
			} else if (self.passed === 1) {
				return self.end();
			}
		} else {
			self.passed = 0;
		}		
	}
	
	this.end = function() {
		let msg = "";
		
		if (self.nPieces[0] > self.nPieces[1]) {
			msg = "Black player won ! The game will restart";
		} else if (self.nPieces[0] > self.nPieces[1]) {
			msg = "White player won ! The game will restart";
		} else {
			msg = "It's a tie ! The game will restart";
		}
		
		let rep = confirm(msg);
		if (rep) {
			self.restart();
		}
	}
	
	this.restart = function() {
		self.pieces = [];
		self.turn = 1; // black player start but nextTurn is called first
		
		//create each pieces and place them in the board
		for (let i = 0; i < 8; i++) {
			self.pieces.push([]);
			for (let j = 0; j < 8; j++) {
				self.pieces.slice(-1)[0].push(new Piece(self, 2 , i, j));
			}
		}
		
		// starting position
		self.pieces[3][3].setColor(1);
		self.pieces[4][4].setColor(1);
		self.pieces[3][4].setColor(0);
		self.pieces[4][3].setColor(0);
		// number of pieces for each player in an array nPieces[0] is black, nPieces[1] is white
		this.nPieces = [2,2];
		
		self.nextTurn();
	}
	
	this.restart();
}

function Piece(game, color, row, col) {
	this.game = game;
	this.color = color;
	this.row = row;
	this.col = col;
	this.element = Array.from(document.getElementsByClassName("board-square"))
									.filter(function(el) {return el.getAttribute("data-pos") === row + " " + col;})[0]
	this.element.className = "board-square"; // erase all other classes
	this.element.classList.add(COLORS[color]);
	
	let self = this;
	this.setColor = function(color) {
		this.element.classList.remove(COLORS[self.color]);
		self.color = color;
		this.element.classList.add(COLORS[color]);
	}
	
	this.setPossible = function(poss) {
		if (poss && self.color !== 3) { // don't mark it twice
			self.setColor(3); // color it dark green
			self.element.addEventListener("click", self.place); // add an onclick listener
		} else if (self.color === 3){ // don't mark it twice
			self.setColor(2); // color it green
			self.element.removeEventListener("click", self.place); // remove onclick listener
		}
	}
	
	this.place = function() {
		if (self.color !== 3) return;
		
		let turn = self.game.turn;
		self.setPossible(false);
		self.setColor(turn);
		for (let i = 0; i < self.flipped.length; i++) {
			self.flipped[i].setColor(turn);
		}
		// calculate points given
		self.game.nPieces[turn] += self.flipped.length + 1
		self.game.nPieces[1 - turn] -= self.flipped.length;
		self.game.nextTurn();
	}
}

function setup() {
	let board = document.getElementById("board");
	let labelPts = document.getElementById("labelpts");

	// create the rows and add them to the board
	for (let i = 0; i < 8; i++) {
		let row = document.createElement("div"); //div element for the row
		row.classList.add("board-row"); // class of the row

		// create the cells and add them to each row
		for (let j = 0; j < 8; j++) {
			let square = document.createElement("div"); // div element for the cell
			square.classList.add("board-square"); //class of the cell
			square.setAttribute("data-pos", i + " " + j); //the title contains the 2D position of the cell
			//square.addEventListener("click", swap); // onclick, swap the cell
			square.style.width = square.style.height = Math.floor(560 / 8) + "px"; // define the size of the cells
			
			row.appendChild(square);
		}
		board.appendChild(row);
	}
	
	let game = new Game(board, labelPts);
}

window.addEventListener("load", setup);