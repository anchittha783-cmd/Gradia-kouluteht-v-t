const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const CELL_SIZE = 20;
const COLS = canvas.width / CELL_SIZE;
const ROWS = canvas.height / CELL_SIZE;

// Vaikeustaso: 'helppo', 'keskivaikea', 'vaikea'
const difficulty = 'keskivaikea';

class Apple {
    constructor() {
        this.position = this.randomPosition();
    }

    randomPosition() {
        const x = Math.floor(Math.random() * COLS) * CELL_SIZE;
        const y = Math.floor(Math.random() * ROWS) * CELL_SIZE;
        return { x, y };
    }

    draw() {
        ctx.fillStyle = 'red';
        ctx.fillRect(this.position.x, this.position.y, CELL_SIZE, CELL_SIZE);
    }
}

class Snake {
    constructor() {
        this.body = [{ x: 100, y: 100 }];
        this.direction = { x: CELL_SIZE, y: 0 };
        this.growth = 0;
        this.speed = 5; // updates per second
    }

    move() {
        const head = { 
            x: this.body[0].x + this.direction.x, 
            y: this.body[0].y + this.direction.y 
        };
        this.body.unshift(head);

        if (this.growth > 0) {
            this.growth--;
        } else {
            this.body.pop();
        }
    }

    grow(amount) {
        this.growth += amount;
    }

    draw() {
        ctx.fillStyle = 'green';
        for (let segment of this.body) {
            ctx.fillRect(segment.x, segment.y, CELL_SIZE, CELL_SIZE);
        }
    }
}

const snake = new Snake();
let apple = new Apple();

// Ohjaus
window.addEventListener('keydown', e => {
    switch(e.key) {
        case 'ArrowUp'   : if(snake.direction.y === 0) snake.direction = {x:0, y:-CELL_SIZE}; break;
        case 'ArrowDown' : if(snake.direction.y === 0) snake.direction = {x:0, y:CELL_SIZE}; break;
        case 'ArrowLeft' : if(snake.direction.x === 0) snake.direction = {x:-CELL_SIZE, y:0}; break;
        case 'ArrowRight': if(snake.direction.x === 0) snake.direction = {x:CELL_SIZE, y:0}; break;
    }
});

// Peli loop
function gameLoop() {
    snake.move();

    // Tarkista omenan syönti
    if(snake.body[0].x === apple.position.x && snake.body[0].y === apple.position.y) {
        if(difficulty === 'helppo') {
            snake.grow(1);
            snake.speed += 1;
        } else if(difficulty === 'keskivaikea') {
            snake.grow(1);
            snake.speed += 2;
        } else if(difficulty === 'vaikea') {
            snake.grow(2);
            snake.speed += 2;
        }
        apple = new Apple();
    }

    // tarkista meneekö käärme reunan yli
    if(snake.body[0].x < 0) {
        snake.body[0].x = canvas.width;
    } else if(snake.body[0].x > canvas.width) {
        snake.body[0].x = 0;
    }else if(snake.body[0].y < 0 ) {
        snake.body[0].y = canvas.height;
    }else if(snake.body[0].y > canvas.height) {
        snake.body[0].y = 0;
    }

    // Piirrä pelialusta
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    ctx.beginPath(); // piirrä border reunat pelikentän ympärille
    ctx.rect(0, 0, canvas.width, canvas.height);
    ctx.stroke();

    snake.draw();
    apple.draw();
}

// Automaattinen päivitys vaikeustason mukaan
// kutsutaan gameLoop() funktiota N kertaa per sekunti.
// nopeus=5 -> 1000/5 = 200ms eli kutsu funktiota 200ms välein.
function startGame() {
    setInterval(gameLoop, 1000 / snake.speed); //1000ms=1sec
}

startGame();