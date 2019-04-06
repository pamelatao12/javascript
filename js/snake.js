const canvasBorderColor = "#6A5ACD";
const canvasBackgroundColor = "#E6E6FA";
const snakeColor = "lightblue";
const snakeBorderColor = "darkblue";
const foodColor = "red";
const foodColorBorder = "black";

let snake = [
  {x: 150, y: 150},
  {x: 140, y: 150},
  {x: 130, y: 150},
  {x: 120, y: 150},
  {x: 110, y: 150},
];

var dx = 10;
var dy = 0;

var xFood;
var yFood;

var score = 0;

var changeDirection;



var gameCanvas = document.getElementById("gameCanvas");
var context = gameCanvas.getContext("2d"); 

function clearCanvas() {
	context.fillStyle = canvasBackgroundColor;
	context.strokeStyle = canvasBorderColor;
	context.fillRect(0, 0, gameCanvas.width, gameCanvas.height);
	context.strokeRect(0, 0, gameCanvas.width, gameCanvas.height);
}

clearCanvas();
positionFood();
drawFood();
drawSnake();


document.addEventListener("keydown", changeDirection);
window.addEventListener("keydown", function(e) {
    // space and arrow keys
    if([32, 37, 38, 39, 40].indexOf(e.keyCode) > -1) {
        e.preventDefault();
    }
}, false);

function main() {
	document.getElementById("startBtn").style.display = "none";
	if (lostGame()) {
			document.getElementById("startBtn").style.display = "inline-block";
			snake = [
				{x: 150, y: 150},
				{x: 140, y: 150},
				{x: 130, y: 150},
				{x: 120, y: 150},
				{x: 110, y: 150},
			];
			return;
		}

	setTimeout(function onTick() {
		clearCanvas();
		drawFood();
		moveSnake();
		drawSnake();

		main();
	}, 100)
}

function moveSnake() {
	directionChange = false;
	var head = {x: snake[0].x + dx, y: snake[0].y + dy};

	snake.unshift(head);
	var ateFood = snake[0].x === xFood && snake[0].y === yFood;
	if (ateFood) {
		positionFood();
		document.getElementById("score").innerHTML = ++score;
	} else {
		snake.pop();
	}
}

function randomPosition(min, max) {
	return Math.round((Math.random() * (max - min) + min) / 10) * 10;
}

function positionFood() {
	xFood = randomPosition(0, gameCanvas.width - 10);
	yFood = randomPosition(0, gameCanvas.height - 10);

	snake.forEach(function isFoodOnSnake(snakePart) {
		if (snakePart.x == xFood && snakePart.y == yFood) {
			positionFood();
		}
	});
}

/**
* Draws the food on the canvas
*/
function drawFood() {
	context.fillStyle = foodColor;
	context.strokeStyle = foodColorBorder;
	context.fillRect(xFood, yFood, 10, 10);
	context.strokeRect(xFood, yFood, 10, 10);
}

/**
* Draws the snake on the canvas
*/
function drawSnake() {
	// loop through the snake parts drawing each part on the canvas
	snake.forEach(drawSnakePart);
}

/**
* Draws a part of the snake on the canvas
* @param { object } snakePart - The coordinates where the part should be drawn
*/
function drawSnakePart(snakePart) {
	// Set the colour of the snake part
	context.fillStyle = snakeColor;
	// Set the border colour of the snake part
	context.strokeStyle = snakeBorderColor;
	// Draw a "filled" rectangle to represent the snake part at the coordinates
	// the part is located
	context.fillRect(snakePart.x, snakePart.y, 10, 10);
	// Draw a border around the snake part
	context.strokeRect(snakePart.x, snakePart.y, 10, 10);
}

function changeDirection(key) {
	const left = 37;
	const up = 38;
	const right = 39;
	const down = 40;

	var keyPressed = key.keyCode;
	var movingUp = dy === -10;
	var movingDown = dy === 10;
	var movingLeft = dx === -10;
	var movingRight = dx === 10;

	if (directionChange) {
		return;
	}
	
	directionChange = true;

	if (keyPressed === right && !movingLeft) {
		dx = 10;
		dy = 0;
	}

	if (keyPressed === left && !movingRight) {
		dx = -10;
		dy = 0;
	}

	if (keyPressed === up && !movingDown) {
		dx = 0;
		dy = -10;
	}

	if (keyPressed === down && !movingUp) {
		dx = 0;
		dy = 10;
	}
}

function lostGame() {
	for (var i = 4; i < snake.length; i++) {
		if (snake[i].x === snake[0].x && snake[i].y === snake[0].y) {
			return true;
		}
	}

	return snake[0].x < 0 || snake[0].y < 0 || 
	snake[0].x > gameCanvas.width - 10 || snake[0].y > gameCanvas.height - 10;
}

