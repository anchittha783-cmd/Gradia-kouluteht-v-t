//board
let board;
const rowCount = 21;
const columnCount = 19;
const tileSize = 32;
const boardWidth = columnCount * tileSize;
const boardHeight = rowCount * tileSize;
let context;

//images
let blueGhostImage;
let orangeGhostImage;
let pinkGhostImage;
let redGhostImage;
let pacmanUpImage;
let pacmanDownImage;
let pacmanLeftImage;
let pacmanRightImage;
let wallImage;

//X = wall, O = skip, P = pac man, ' ' = food
//Ghosts: b = blue, o = orange, p = pink, r = red
const tileMap = [
    "XXXXXXXXXXXXXXXXXXX",
    "X        X        X",
    "X XX XXX X XXX XX X",
    "X                 X",
    "X XX X XXXXX X XX X",
    "X    X       X    X",
    "XXXX XXXX XXXX XXXX",
    "OOOX X       X XOOO",
    "XXXX X XXrXX X XXXX",
    "O        bpo      O",
    "XXXX X XXXXX X XXXX",
    "OOOX X       X XOOO",
    "XXXX X XXXXX X XXXX",
    "X        X        X",
    "X XX XXX X XXX XX X",
    "X  X     P     X  X",
    "XX X X XXXXX X X XX",
    "X    X   X   X    X",
    "X XXXXXX X XXXXXX X",
    "X                 X",
    "XXXXXXXXXXXXXXXXXXX"
];
// sets to store walls, food, ghosts, and pacman
const walls = new Set();
const foods = new Set();
const ghosts = new Set();
let pacman;

const direction = ['U', 'D', 'L', 'R']; //up, down, left, right

let score = 0;
let lives = 3;
let gameOver = false;
// initialize the game when the window loads
window.onload = function () {
    board = document.getElementById("board");
    board.height = boardHeight;
    board.width = boardWidth;
    context = board.getContext("2d"); // used for drawing on the board

    loadImages();
    loadMap();

    for (let ghost of ghosts.values()) {
        const newDirection = direction[Math.floor(Math.random() * 4)];
        ghost.updateDirection(newDirection);
    }

    update();
    document.addEventListener("keyup", movePacman);
}
// load images for walls, ghosts, and pacman
function loadImages() {
    wallImage = new Image();
    wallImage.src = "./wall.png";

    blueGhostImage = new Image();
    blueGhostImage.src = "./blueghost.png";
    orangeGhostImage = new Image();
    orangeGhostImage.src = "./orangeghost.png";
    pinkGhostImage = new Image();
    pinkGhostImage.src = "./pinkghost.png";
    redGhostImage = new Image();
    redGhostImage.src = "./redghost.png";

    pacmanUpImage = new Image();
    pacmanUpImage.src = "./pacmanup.png";
    pacmanDownImage = new Image();
    pacmanDownImage.src = "./pacmandown.png";
    pacmanLeftImage = new Image();
    pacmanLeftImage.src = "./pacmanleft.png";
    pacmanRightImage = new Image();
    pacmanRightImage.src = "./pacmanright.png";
}
// class for walls, food, ghosts, and pacman, since they all have similar properties and methods (position, size, image, direction, velocity, etc.)
class Block {
    constructor(image, x, y, width, height) {
        this.image = image;
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;

        this.startX = x;
        this.startY = y;

        this.direction = 'R';
        this.velocityX = 0;
        this.velocityY = 0;
    }
// update direction and velocity, and check for collisions with walls, if there is a collision, revert to previous position and direction
    updateDirection(direction) {
        const previousDirection = this.direction;
// move in the new direction
        this.direction = direction;
        this.updateVelocity();
        this.x += this.velocityX;
        this.y += this.velocityY;

        for (let wall of walls.values()) {
            if (collision(this, wall)) {
                this.x -= this.velocityX;
                this.y -= this.velocityY;
                this.direction = previousDirection;
                this.updateVelocity();
                return;
            }
        }
    }
// update velocity based on current direction
    updateVelocity() {
        if (this.direction == 'U') {
            this.velocityX = 0;
            this.velocityY = -tileSize / 4;
        }
        else if (this.direction == 'D') {
            this.velocityX = 0;
            this.velocityY = tileSize / 4;
        }
        else if (this.direction == 'L') {
            this.velocityX = -tileSize / 4;
            this.velocityY = 0;
        }
        else if (this.direction == 'R') {
            this.velocityX = tileSize / 4;
            this.velocityY = 0;
        }
    }

    reset() {
        this.x = this.startX;
        this.y = this.startY;
    }
}
// load the map from the tileMap array, creating walls, food, ghosts, and pacman based on the characters in the array
function loadMap() {
    walls.clear();
    foods.clear();
    ghosts.clear();

    for (let r = 0; r < rowCount; r++) {
        for (let c = 0; c < columnCount; c++) {
            const row = tileMap[r];
            const tileMapChar = row[c];

            const x = c * tileSize;
            const y = r * tileSize;

            if (tileMapChar == 'X') {
                const wall = new Block(wallImage, x, y, tileSize, tileSize);
                walls.add(wall);
            }
            else if (tileMapChar == 'b') {
                const ghost = new Block(blueGhostImage, x, y, tileSize, tileSize);
                ghosts.add(ghost);
            }
            else if (tileMapChar == 'o') {
                const ghost = new Block(orangeGhostImage, x, y, tileSize, tileSize);
                ghosts.add(ghost);
            }
            else if (tileMapChar == 'p') {
                const ghost = new Block(pinkGhostImage, x, y, tileSize, tileSize);
                ghosts.add(ghost);
            }
            else if (tileMapChar == 'r') {
                const ghost = new Block(redGhostImage, x, y, tileSize, tileSize);
                ghosts.add(ghost);
            }
            else if (tileMapChar == 'P') {
                pacman = new Block(pacmanRightImage, x, y, tileSize, tileSize);
            }
            else if (tileMapChar == ' ') {
                const food = new Block(null, x + 14, y + 14, 4, 4);
                foods.add(food);
            }
        }
    }
}
// main game loop, updates the game state and redraws the board every 50 milliseconds
function update() {
    if (gameOver) {
        return;
    }
    move();
    draw();
    setTimeout(update, 50);
}
// draw pacman, ghosts, walls, and food on the board, and display score and lives
function draw() {
    context.clearRect(0, 0, boardWidth, boardHeight);

    context.drawImage(pacman.image, pacman.x, pacman.y, pacman.width, pacman.height);
    for (let ghost of ghosts.values()) {
        context.drawImage(ghost.image, ghost.x, ghost.y, ghost.width, ghost.height);
    }
    for (let wall of walls.values()) {
        context.drawImage(wall.image, wall.x, wall.y, wall.width, wall.height);
    }
    context.fillStyle = "white";
    for (let food of foods.values()) {
        context.fillRect(food.x, food.y, food.width, food.height);
    }

    //score 
    context.fillStyle = "white";
    context.font = "14px Arial";
    if (gameOver) {
        context.fillText("Game Over. Score: " + String(score), tileSize / 2, tileSize / 2);
    }
    else {
        context.fillText("Lives: " + String(lives) + " Score: " + String(score), tileSize / 2, tileSize / 2);
    }
}
// move pacman and ghosts, check for collisions with walls, food, and ghosts, and update score and lives accordingly
function move() {
    pacman.x += pacman.velocityX;
    pacman.y += pacman.velocityY;

    for (let wall of walls.values()) {
        if (collision(pacman, wall)) {
            pacman.x -= pacman.velocityX;
            pacman.y -= pacman.velocityY;
            break;
        }
    }

    for (let ghost of ghosts.values()) {
        if (collision(ghost, pacman)) {
            lives -= 1;
            if (lives == 0) {
                gameOver = true;
                draw();
                return;
            }
            resetPositions();
            return; 
        }

        // ghost move
        ghost.x += ghost.velocityX;
        ghost.y += ghost.velocityY;

        let hitWall = false;// check if ghost hits a wall or goes out of bounds
        for (let wall of walls.values()) {
            if (collision(ghost, wall) || ghost.x <= 0 || ghost.x >= boardWidth - tileSize || ghost.y <= 0 || ghost.y >= boardHeight - tileSize) {
                hitWall = true;
                break;
            }
        }

        if (hitWall) {// if ghost hits a wall or goes out of bounds, move it back and choose a new random direction
            ghost.x -= ghost.velocityX;
            ghost.y -= ghost.velocityY;
            const newDirection = direction[Math.floor(Math.random() * 4)];
            ghost.direction = newDirection;
            ghost.updateVelocity();
        }

        else if (ghost.x % tileSize === 0 && ghost.y % tileSize === 0) {
            let validDirections = [];

            for (let d of direction) {// don't allow reversing direction unless it's the only option (dead end)
                if (d === 'U' && ghost.direction === 'D') continue;
                if (d === 'D' && ghost.direction === 'U') continue;
                if (d === 'L' && ghost.direction === 'R') continue;
                if (d === 'R' && ghost.direction === 'L') continue;
                // check if the new position in direction d is blocked by a wall or out of bounds
                let testX = ghost.x;
                let testY = ghost.y;
                if (d === 'U') testY -= tileSize;
                else if (d === 'D') testY += tileSize;
                else if (d === 'L') testX -= tileSize;
                else if (d === 'R') testX += tileSize;

                let testRect = { x: testX, y: testY, width: tileSize, height: tileSize };
                let isBlocked = false;

                for (let wall of walls.values()) {
                    if (collision(testRect, wall)) {
                        isBlocked = true;
                        break;
                    }
                }
                if (testX < 0 || testX >= boardWidth || testY < 0 || testY >= boardHeight) {// check if the new position is out of bounds
                    isBlocked = true;
                }

                if (!isBlocked) {
                    validDirections.push(d);// add valid direction to the list
                }
            }

            //randomly choose a valid direction to move, but don't allow reversing direction unless it's the only option (dead end)
            if (validDirections.length > 0) {
                let randomDir = validDirections[Math.floor(Math.random() * validDirections.length)];
                ghost.direction = randomDir;
                ghost.updateVelocity();
            } else {
                // if no valid directions, reverse direction (dead end)
                if (ghost.direction === 'U') ghost.direction = 'D';
                else if (ghost.direction === 'D') ghost.direction = 'U';
                else if (ghost.direction === 'L') ghost.direction = 'R';
                else if (ghost.direction === 'R') ghost.direction = 'L';
                ghost.updateVelocity();
            }
        }
    }

    // check if pacman eats food
    let foodEaten = null;
    for (let food of foods.values()) {
        if (collision(pacman, food)) {
            foodEaten = food;
            score += 10;
            break;
        }
    }
    if (foodEaten) foods.delete(foodEaten);
}

// handle keyboard input to move pacman
function movePacman(e) {
    if (gameOver) {
        if (e.code == "Space" || e.code == "Enter") { // กด Spacebar หรือ Enter เพื่อเริ่มใหม่
            loadMap();
            resetPositions();
            lives = 3;
            score = 0;
            gameOver = false;
            update();
        }
        return;
    }
// required to change pacman image direction when moving, but also allows changing direction without moving if already moving in a different direction (e.g. pressing up while moving right will change image to up but pacman will continue moving right until it reaches a wall, then it will start moving up) which is how the original pacman works
    if (e.code == "ArrowUp" || e.code == "KeyW") {
        pacman.updateDirection('U');
        pacman.image = pacmanUpImage;
    }
    else if (e.code == "ArrowDown" || e.code == "KeyS") {
        pacman.updateDirection('D');
        pacman.image = pacmanDownImage;
    }
    else if (e.code == "ArrowLeft" || e.code == "KeyA") {
        pacman.updateDirection('L');
        pacman.image = pacmanLeftImage;
    }
    else if (e.code == "ArrowRight" || e.code == "KeyD") {
        pacman.updateDirection('R');
        pacman.image = pacmanRightImage;
    }
}
// check collision between two rectangles
function collision(a, b) {
    return a.x < b.x + b.width &&
        a.x + a.width > b.x &&
        a.y < b.y + b.height &&
        a.y + a.height > b.y;
}
// reset positions of pacman and ghosts after losing a life
function resetPositions() {
    pacman.reset();
    pacman.velocityX = 0;
    pacman.velocityY = 0;
    pacman.direction = 'R';
    pacman.image = pacmanRightImage;
    for (let ghost of ghosts.values()) {
        ghost.reset();
        const newDirection = direction[Math.floor(Math.random() * 4)];
        ghost.updateDirection(newDirection);
    }
}
