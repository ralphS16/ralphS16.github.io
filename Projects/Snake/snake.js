// CONSTANTS
const UP = new Vector(0,-1);
const DOWN = new Vector(0,1);
const LEFT = new Vector(-1,0);
const RIGHT = new Vector(1,0);
const DIR = [LEFT, UP, RIGHT, DOWN];

const KEY_LEFT = 37;
const KEY_UP = 38;
const KEY_RIGHT = 39;
const KEY_DOWN = 40;


// This is the code for the snake game
function Game(canvas) {
	canvas.game = this; // just to make sure no two games are started on the same canvas

	// This object contains a game that is played
	this.canvas = canvas;
	this.gridSize = 10; // px side of each box in the grid
	this.width = Math.floor(canvas.width/this.gridSize); // width and height are in number of boxes per side
	this.height = Math.floor(canvas.height/this.gridSize);
	this.snake = new Snake(this); // create the Snake

	let self = this; // use 'this' in the functions
	this.update = function() {
		// this function updates the content of the game, it will be called periodically

		// call the snake methods that update it
		self.snake.update();

		if (!self.food) { //  if there is no food in the game, put one at a random spot that is not covered by the snake
			do { // *********** This sometimes glitch... *************
				self.food = new Vector(randomRange(0,self.width), randomRange(0,self.height));
			} while (self.snake.body.includes(self.food));
		}

		self.show() // draw

	};

	this.show = function() {
		// this function draws the game content

		let ctx = canvas.getContext("2d"); // to draw

		// erase everything from last frame
		ctx.clearRect(0, 0, canvas.width, canvas.height);

		// draw the food in red
		ctx.fillStyle = "red";
		ctx.fillRect(self.food.x*self.gridSize, self.food.y*self.gridSize, self.gridSize, self.gridSize);

		// call the snake method to draw it
		self.snake.show();
	}

	this.keyDown = function(e) {
		// handles keydown event to change the direction of the snake
		switch (e.keyCode) {
			case KEY_LEFT :
				if (self.snake.aDir !== RIGHT) self.snake.direction = LEFT;
				break;
			case KEY_UP:
				if (self.snake.aDir !== DOWN) self.snake.direction = UP;
				break;
			case KEY_DOWN:
				if (self.snake.aDir !== UP) self.snake.direction = DOWN;
				break;
			case KEY_RIGHT:
				if (self.snake.aDir !== LEFT) self.snake.direction = RIGHT;
				break;
		}
	};

	this.loose = function() {
		// when you loose the game, you are prompted to restart the game or not
		let rep = confirm("You lost, the game will restart.");
		if (rep) {
			self.restart(); // restart the game
		} else {
			clearInterval(self.timer); // remove the periodic calling of update
		}
	};

	this.restart = function() {
		// this restarts the game
		self.snake = new Snake(self);

		//clear and set back the timer
		clearInterval(self.timer);
		this.timer = setInterval(this.update, 100);
	};

	this.timer = setInterval(this.update, 100); // periodically call update each 100 ms
}

function Snake(game) {

	this.game = game; // game in which the snake plays
	this.body = []; //  array of the position of the body
	this.body.push(new Vector(randomRange(0,this.game.width), randomRange(0,this.game.height))); //starting point
	this.direction = DIR[Math.floor(Math.random()*DIR.length)];
	this.aDir = this.direction // actual direction variable so that it gets updated and not glitch (RIGHT -> DOWN is only interpreted as DOWN so you can't go backwards

	let self = this;
	this.show = function() {
		// show the snake in the canvas
		let ctx = game.canvas.getContext("2d"); // to draw

		for (let i = 0; i < self.body.length; i++) { // for each part of the body
			// draw a white square at its coordinate
			let part = self.body[i];
			ctx.fillStyle = "white";
			ctx.fillRect(part.x*game.gridSize, part.y*game.gridSize, game.gridSize, game.gridSize);
		}
	};

	this.update = function() {
		//makes the snake move and react to its environement
		self.aDir = self.direction // changes the actual direction
		self.collision(); // test for collision
		self.body = [self.body[0].move(self.aDir, self.game.width, self.game.height)].concat(self.body.slice(0,-1)); // shift the whole snake by one
	};

	this.collision = function() {
		// parse the array and substract each vector of the body to the head
		// to see if it is equal to the direction and collide if so

		let  head = self.body[0]; // head of the snake
		let nextPos = head.move(self.aDir, self.game.width, self.game.height);

		if	(nextPos.equals(self.game.food)) { // if the head moves to the food, eat it
			self.body.push(self.body.slice(-1)[0]); // add the last part to the body so it grows in length;
			self.game.food = undefined; // set the food to undefined to spawn new one
		}


		// if the head will to the direction to one of the body part, it dies
		if (self.body.length > 1) {
			for (let i = 1; i < self.body.length - 1; i++) { //don't check the last one since it will be moved
				if (nextPos.equals(self.body[i])) {
					game.loose();
				}
			}
		}


	};
}

function Vector(x,y) {
	// this is a 2D vector data structure to simplify code
	this.x = x; // coordinatees of the vector
	this.y = y;

	let self = this;
	this.add= function (oV) {
		// add vectors together
		return new Vector(this.x + oV.x, this.y + oV.y);
	};

	this.move = function (oV, cX, cY) {
		// this is like the add function makes vector cross the map from the sides
		// cX and cY are the width and height constraints
		let newX = (this.x + oV.x)  >= 0 ? (this.x + oV.x) % cX : (this.x + oV.x) + cX
		let newY = (this.y + oV.y)  >= 0 ? (this.y + oV.y) % cY : (this.y + oV.y) + cY
		return new Vector(newX, newY);
	};

	this.sub = function(oV) {
		// substract a vector to another
		return new Vector(this.x - oV.x, this.y - oV.y);
	};

	this.equals = function(oV) {
		// verify if vectors are equal
		return oV && self.x === oV.x && self.y === oV.y;
	};
}

function randomRange(min,max) {
	// random integer in a range
	return Math.floor(Math.random()*(max-min)) + min;
}

function setup() {
	// setup on loading of the window
	let startButton = document.getElementById("start");
	let canvas = document.getElementById("game-container");
	let game;

	startButton.addEventListener("click",  // clicking on the button event
			function () {
				if (! canvas.game) { // if there is no game, create a game
					game = new Game(canvas);
					window.addEventListener("keydown", game.keyDown, false);
				} else {
					game.restart(); // else, restart the game
				}
			});
}

window.addEventListener("load", setup);
