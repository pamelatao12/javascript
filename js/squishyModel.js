class EventEmitter {
  constructor() {
    this._events = {};
  }
// for adding event handler
  on(event, listener) {
    (this._events[event] || (this._events[event] = [])).push(listener);
    return this;
  }
// for calling event handlers for specified event
  emit(event, arg) {
    (this._events[event] || []).slice().forEach(lsn => lsn(arg));
  }
}


/**
* The Model - stores data, notifies observers about changes
*/
class Model extends EventEmitter {

	constructor() {
		super();
		this.snake = [
		  {x: 160, y: 160},
		  {x: 140, y: 160},
		  {x: 120, y: 160},
		  {x: 100, y: 160},
		  {x: 80, y: 160},
		];
		this.dx = 20;
		this.dy = 0;
		this.xFood = 400;
		this.yFood = 400;

		this.score = 0;

		this.directionChange;

		this.speed = 100;
		this.width = 600;
		this.height = 600;
		this.automate = false;
		this.prevDirection;
		this.pause = false;
	}

	moveSnake() {
		this.emit('hideButton');
		this.emit('scoreSet', this.score);
		this.directionChange = false;
		var head = {x: this.snake[0].x + this.dx, y: this.snake[0].y + this.dy};

		this.snake.unshift(head);
		var ateFood = this.snake[0].x === this.xFood && this.snake[0].y === this.yFood;
		if (ateFood) {
			if (this.speed > 50) {
				this.speed -= 5;
			}
			this.positionFood();
			this.score++;
			this.emit('scoreSet', this.score);
		} else {
			this.snake.pop();
		}
		this.emit('clearCanvas');
		this.emit('snakeMoved', this.snake);
		this.emit('foodMoved');

		if (this.lostGame()) {
			this.emit('lostGame');
		}
	}

	randomPosition(min, max) {
		var number = Math.round((Math.random() * (max - min) + min) / 10) * 10;
		if(number > 0) {
	        return Math.ceil(number/20.0) * 20;
		} else {
	        return 20;
		}
	}

	setPositionFood() {
		this.xFood = this.randomPosition(0, this.width - 20);
		this.yFood = this.randomPosition(0, this.height - 20);
	}

	positionFood() {
		var oldXFood = this.xFood;
		var oldYFood = this.yFood;
		this.setPositionFood()

		for (var i = 0; i < this.snake.length; i++) {
			if ((this.snake[i].x == this.xFood && this.snake[i].y == this.yFood) || 
				(oldXFood == this.xFood || oldYFood == this.yFood)) {
				this.positionFood();
			}
		}

		this.emit('clearCanvas', this.speed);
		this.emit('foodMoved', this.xFood);
	}

	changeDirection(key) {
		const left = 37;
		const up = 38;
		const right = 39;
		const down = 40;

		var keyPressed = key.keyCode;
		var movingUp = this.dy === -20;
		var movingDown = this.dy === 20;
		var movingLeft = this.dx === -20;
		var movingRight = this.dx === 20;

		if (this.directionChange) {
			return;
		}
		
		this.directionChange = true;

		if (keyPressed === right && !movingLeft) {
			this.dx = 20;
			this.dy = 0;
		}

		if (keyPressed === left && !movingRight) {
			this.dx = -20;
			this.dy = 0;
		}

		if (keyPressed === up && !movingDown) {
			this.dx = 0;
			this.dy = -20;
		}

		if (keyPressed === down && !movingUp) {
			this.dx = 0;
			this.dy = 20;
		}
	}

	lostGame() {
		for (var i = 4; i < this.snake.length; i++) {
			if (this.snake[i].x == this.snake[0].x && this.snake[i].y == this.snake[0].y) {
				return true;
			}
		}

		return this.snake[0].x < 0 || this.snake[0].y < 0 || 
			this.snake[0].x > this.width - 20 || this.snake[0].y > this.height - 20;
	}

	restart() {
		this.snake = [
		  {x: 160, y: 160},
		  {x: 140, y: 160},
		  {x: 120, y: 160},
		  {x: 100, y: 160},
		  {x: 80, y: 160},
		];
		this.setPositionFood();
		this.dx = 20;
		this.dy = 0;
		this.score = 0;
		this.speed = 100;
	}

	reload() {
		this.snake = [
		  {x: 160, y: 160},
		  {x: 140, y: 160},
		  {x: 120, y: 160},
		  {x: 100, y: 160},
		  {x: 80, y: 160},
		];
		this.setPositionFood();
		this.dx = 20;
		this.dy = 0;
		this.score = 0;
		this.speed = 100;
		this.emit('clearCanvas');
		this.emit('snakeMoved');
		this.emit('foodMoved');
		this.emit('scoreSet');
		this.emit('lostGame');
	}

	automateGame() {
		if (this.dy != 0 && this.snake[0].x < this.xFood) {
			this.prevDirection = this.dy;
			this.dy = 0;
			this.dx = 20;
		} 
		if (this.dy != 0 && this.snake[0].x > this.xFood) {
			this.prevDirection = this.dy;
			this.dy = 0;
			this.dx = -20;
		} 
		if (this.dx != 0 && this.snake[0].y > this.yFood) {
			this.prevDirection = this.dx;
			this.dy = -20;
			this.dx = 0;
		} 
		if (this.dx != 0 && this.snake[0].y < this.yFood) {
			this.prevDirection = this.dx;
			this.dy = 20;
			this.dx = 0;
		} 

		for (var i = 0; i < this.snake.length; i++) {
			if (this.prevDirection == 20 && this.dx == 20 && this.snake[0].x + 20 == this.snake[i].x && this.snake[0].y == this.snake[i].y) {
				this.dy = 20;
				this.dx = 0;
			} else if (this.prevDirection == 20 && this.dx == -20 && this.snake[0].x - 20 == this.snake[i].x && this.snake[0].y == this.snake[i].y) {
				this.dy = 20;
				this.dx = 0;
			} else if (this.prevDirection == -20 && this.dx == -20 && this.snake[0].x - 20 == this.snake[i].x && this.snake[0].y == this.snake[i].y) {
				this.dy = -20;
				this.dx = 0;
			} else if (this.prevDirection == 20 && this.dx == 20 && this.snake[0].x + 20 == this.snake[i].x && this.snake[0].y == this.snake[i].y) {
				this.dy = -20;
				this.dx = 0;
			} else if (this.prevDirection == 20 && this.dy == -20 && this.snake[0].y - 20 == this.snake[i].y && this.snake[0].x == this.snake[i].x) {
				this.dy = 0;
				this.dx = 20;
			} else if (this.prevDirection == 20 && this.dy == 20 && this.snake[0].y + 20 == this.snake[i].y && this.snake[0].x == this.snake[i].x) {
				this.dy = 0;
				this.dx = 20;
			} else if (this.prevDirection == -20 && this.dy == -20 && this.snake[0].y - 20 == this.snake[i].y && this.snake[0].x == this.snake[i].x) {
				this.dy = 0;
				this.dx = -20;
			} else if (this.prevDirection == -20 && this.dy == 20 && this.snake[0].y + 20 == this.snake[i].y && this.snake[0].x == this.snake[i].x) {
				this.dy = 0;
				this.dx = -20;
			}
		}

		var onBottom = false;
		var onTop = false;
		var onLeft = false;
		var onRight = false;

		for (var i = 1; i < this.snake.length; i++) {
			if (this.snake[0].y + 20 == this.snake[i].y && this.snake[0].x == this.snake[i].x) {
				onBottom = true;
			}
			if (this.snake[0].y - 20 == this.snake[i].y && this.snake[0].x == this.snake[i].x) {
				onTop = true;
			}
			if (this.snake[0].x + 20 == this.snake[i].x && this.snake[0].y == this.snake[i].y) {
				onRight = true;
			} 
			if (this.snake[0].x - 20 == this.snake[i].x && this.snake[0].y == this.snake[i].y) {
				onLeft = true;
			}
		}

		if (onBottom && onTop && onRight) {
			this.dx = -20;
			this.dy = 0;
		} else if (onBottom && onTop && onLeft) {
			this.dx = 20;
			this.dy = 0;
		} else if (onBottom && onRight && onLeft) {
			this.dx = 0;
			this.dy = -20;
		} else if (onTop && onRight && onLeft) {
			this.dx = 0;
			this.dy = 20;
		}
	}

	automateOff() {
		this.automate = false;
	}

	automateOn() {
		this.automate = true;
	}

	isAuto() {
		return this.automate;
	}

	pausePressed() {
		this.pause = true;
	}

	gamePaused() {
		this.pause = false;
		this.emit('pauseGame');
	}

	didGamePause() {
		return this.pause;
	}

	getScore() {
		return this.score;	
	}

	getxFood() {
		return this.xFood;
	}

	getyFood() {
		return this.yFood;
	}

	getSnake() {
		return this.snake;
	}

	getSpeed() {
		return this.speed;
	}

}

class Controller {
	constructor(model, view) {
		this._model = model;
		this._view = view;
		this.gameStarted = false;
		view.on("keyPressed", key => this.changeDirection(key));
		view.on("startButtonClicked", () => this.startGame());
		view.on("autoButtonClicked", () => this.automateGame());
		view.on("pauseButtonClicked", () => this.restartGame());
	}

	changeDirection(key) {
		this._view.autoButtonUnstyle();
		this._model.automateOff();
		this._model.changeDirection(key);
	}

	restartGame() {
		this._model.pausePressed();
	}

	startGame() {
		this.gameStarted = true;
		if (this._model.lostGame()) {
			this._model.restart();
			this._model.automateOff();
			return;
		}
		if (this._model.isAuto()) {
			this._model.automateGame();
		}

		if (this._model.didGamePause()) {
			this._model.gamePaused();
			return;
		}

		setTimeout(this.onTick, this._model.getSpeed(), this._model, this._view, this);
	}

	onTick(model, view, controller) {
		this._view = view;
		this._model = model;
		this._controller = controller;
		this._view.drawFood();
		this._model.moveSnake();
		this._controller.startGame();
	}

	automateGame() {
		this._view.autoButtonStyle();
		this._model.automateOn();
		if (this.gameStarted == false) {
			this.startGame();
		}
		
	}
}


class View extends EventEmitter {

	constructor(model, elements) {
		super();
		this._model = model;
		this._elements = elements;

		model.on('hideButton', () => this.hideButton());
		model.on('snakeMoved', () => this.drawSnake());
		model.on('foodMoved', () => this.drawFood());
		model.on('scoreSet', () => this.setScore());
		model.on('lostGame', () => this.lostGame());
		model.on('clearCanvas', () => this.clearCanvas());
		model.on('pauseGame', () => this.lostGame());

		
		elements.startButton.addEventListener("click", () => this.emit("startButtonClicked"));
		elements.autoButton.addEventListener("click", () => this.emit("autoButtonClicked"));
		elements.gameCanvas.addEventListener("click", () => this.emit("pauseButtonClicked"));

		document.addEventListener("keydown", key => this.emit('keyPressed', key));

		window.addEventListener("keydown", function(e) {
			    // space and arrow keys
			    if([32, 37, 38, 39, 40].indexOf(e.keyCode) > -1) {
			        e.preventDefault();
			    }
			}, false);
	}

	clearCanvas() {
		this._elements.context.fillStyle = "#fff5e6";
		this._elements.context.strokeStyle = "brown";
		this._elements.context.fillRect(0, 0, this._elements.gameCanvas.width, this._elements.gameCanvas.height);
		this._elements.context.strokeRect(0, 0, this._elements.gameCanvas.width, this._elements.gameCanvas.height);
	}


	lostGame() {
		this._elements.startButton.style.display = "inline-block";
	}

	hideButton() {
		this._elements.startButton.style.display = "none";
	}

	/**
	* Draws the snake on the canvas
	*/
	drawSnake() {
		// loop through the snake parts drawing each part on the canvas
		this.snake = this._model.snake;
		for (var i = 0; i < this.snake.length; i++) {
			this._elements.context.drawImage(this._elements.img, this.snake[i].x, this.snake[i].y, 20, 20);
		}
	}


	/**
	* Draws the food on the canvas
	*/
	drawFood() {
		this._elements.context.drawImage(this._elements.acorn, this._model.getxFood(), this._model.getyFood(), 20, 20);
	}

	setScore() {
		this._elements.score.innerHTML = this._model.getScore();
	}

	autoButtonStyle() {
		this._elements.autoButton.style.color = "white";
		this._elements.autoButton.style.backgroundColor = "dimgray";
	}

	autoButtonUnstyle() {
		this._elements.autoButton.style.color = "black";
		this._elements.autoButton.style.backgroundColor = "lightgray";
	}
}

window.addEventListener('load', () => {
  const model = new Model(['node.js', 'react']),
    view = new View(model, {
      'startButton' : document.getElementById('squishyStartBtn'),
      'autoButton' : document.getElementById('autoBtn'),
      'pauseButton' : document.getElementById('pauseBtn'),
      'score' : document.getElementById('score'),
      'gameCanvas' : document.getElementById("gameCanvas"),
      'context' : document.getElementById("gameCanvas").getContext("2d"),
      'img' : document.getElementById("squishyImg"),
      'acorn' : document.getElementById("acornImg")
    }),
    controller = new Controller(model, view);

  view.clearCanvas();
  view.lostGame();
  view.drawSnake();
  view.drawFood();
});

