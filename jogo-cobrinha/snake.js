class Snake {
  constructor() {
    this.iniciarVariaveis();
  }
  iniciarVariaveis() {
    this.x = 20;
    this.y = 20;
    this.size = 20;
    this.tail = [{ x: this.x, y: this.y }];
    this.rotateX = 0;
    this.rotateY = 1;
  }

  move() {
    var newRect;
    if (this.rotateX == 1) {
      newRect = {
        x: this.tail[this.tail.length - 1].x + this.size,
        y: this.tail[this.tail.length - 1].y,
      };
    } else if (this.rotateX == -1) {
      newRect = {
        x: this.tail[this.tail.length - 1].x - this.size,
        y: this.tail[this.tail.length - 1].y,
      };
    } else if (this.rotateY == 1) {
      newRect = {
        x: this.tail[this.tail.length - 1].x,
        y: this.tail[this.tail.length - 1].y + this.size,
      };
    } else if (this.rotateY == -1) {
      newRect = {
        x: this.tail[this.tail.length - 1].x,
        y: this.tail[this.tail.length - 1].y - this.size,
      };
    }
    this.tail.shift();
    this.tail.push(newRect);
  }
}

class RLSnake {
  constructor() {
    this.alpha = 0.2;
    this.gamma = 0.2;
    this.noEatLoopCount = 0;
    this.maxNoEatLoopCount = 500;
    this.isAheadClearIndex = 0;
    this.isLeftClearIndex = 1;
    this.isRightClearIndex = 2;
    this.isAppleAheadIndex = 3;
    this.isAppleLeftIndex = 4;
    this.isAppleRightIndex = 5;
    this.initialState = [1, 1, 1, 0, 0, 0];
    this.state = this.initialState;
    this.Q_table = {};
  }
  calculateState() {}
  update() {}
  reward(state, action) {}
  implementAction(action) {}
  getQ(state, action) {}
  setQ(state, action) {}
  getAction(state) {}
  checkDirections() {}
}

class Apple {
  constructor() {
    var tocando;
    while (true) {
      tocando = false;
      this.x =
        Math.floor((Math.random() * canvas.width) / snake.size) * snake.size;
      this.y =
        Math.floor((Math.random() * canvas.height) / snake.size) * snake.size;
      for (var i = 0; i < snake.tail.length; i++) {
        if (this.x == snake.tail[i].x && this.y == snake.tail[i].y) {
          tocando = true;
        }
      }
      this.size = snake.size;
      this.color = "red";
      if (!tocando) {
        break;
      }
    }
  }
}

var canvas = document.getElementById("canvas");
var snake = new Snake();
var apple = new Apple();
var canvasContext = canvas.getContext("2d");
let gameSpeed = 10;
let gameSpeedElement = document.getElementById("gameSpeed");
let maiorPlacar = 0;

let maiorPlacarElement = document.getElementById("highscore");

gameSpeedElement.addEventListener("change", () => {
  gameSpeed = parseint(gameSpeedElement.textContent);
});

window.onload = () => {
  gameLoop();
};

function gameLoop() {
  setInterval(show, 1000 / gameSpeed);
}

function show() {
  update();
  draw();
}

function update() {
  canvasContext.clearRect(0, 0, canvas.width, canvas.height);
  //console.log("update");
  snake.move();
  eatApple();
  checkColisao();
}

function checkColisao() {
  var cauda = snake.tail[snake.tail.length - 1];
  if (
    //colidir com parede
    cauda.x <= -snake.size ||
    cauda.x >= canvas.width ||
    cauda.y <= -snake.size ||
    cauda.y >= canvas.height
  ) {
    gameOver();
    return;
  }
  for (let i = 0; i < snake.tail.length - 2; i++) {
    if (cauda.x == snake.tail[i].x && cauda.y == snake.tail[i].y) {
      //colidir consigo mesma
      gameOver();
      return;
    }
  }
}

function gameOver() {
  maiorPlacar = Math.max(maiorPlacar, snake.tail.length - 1);
  maiorPlacarElement.textContent = maiorPlacar;

  snake.iniciarVariaveis();
}

function eatApple() {
  if (
    snake.tail[snake.tail.length - 1].x == apple.x &&
    snake.tail[snake.tail.length - 1].y == apple.y
  ) {
    snake.tail[snake.tail.length] = { x: apple.x, y: apple.y };
    apple = new Apple();
  }
}

function draw() {
  createRect(0, 0, canvas.width, canvas.height, "black");
  createRect(0, 0, canvas.width, canvas.height);
  for (var i = 0; i < snake.tail.length; i++) {
    createRect(
      snake.tail[i].x + 2.5,
      snake.tail[i].y + 2.5,
      snake.size - 5,
      snake.size - 5,
      "green"
    );
  }
  canvasContext.font = "20px Arial";
  canvasContext.fillStyle = "white";
  canvasContext.fillText(
    "Score: " + (snake.tail.length - 1),
    canvas.width - 120,
    18
  );
  createRect(apple.x, apple.y, apple.size, apple.size, apple.color);
}

function createRect(x, y, width, height, color) {
  canvasContext.fillStyle = color;
  canvasContext.fillRect(x, y, width, height);
}

window.addEventListener("keydown", (event) => {
  setTimeout(() => {
    if (event.keyCode == 37 && snake.rotateX != 1) {
      snake.rotateX = -1;
      snake.rotateY = 0;
    } else if (event.keyCode == 38 && snake.rotateY != 1) {
      snake.rotateX = 0;
      snake.rotateY = -1;
    } else if (event.keyCode == 39 && snake.rotateX != -1) {
      snake.rotateX = 1;
      snake.rotateY = 0;
    } else if (event.keyCode == 40 && snake.rotateY != -1) {
      snake.rotateX = 0;
      snake.rotateY = 1;
    }
  });
});
