const rows = 20;
const cols = 20;
const mazeContainer = document.getElementById("maze");

let grid = [];
let stack = [];
let zelda;  // Référence à Zelda

function setup() {
    mazeContainer.style.width = `${cols * 20}px`;
    mazeContainer.style.height = `${rows * 20}px`;

    for (let i = 0; i < rows; i++) {
        let row = [];
        for (let j = 0; j < cols; j++) {
            let cell = new Cell(i, j);
            row.push(cell);
            cell.render();
        }
        grid.push(row);
    }

    // Set the entrance
    let entrance = grid[0][0];
    entrance.visited = true;
    entrance.div.classList.add('entrance');
    stack.push(entrance);

    // Set the exit
    let exit = grid[rows - 1][cols - 1];
    exit.div.classList.add('exit');

    draw();
}

function draw() {
    let interval = setInterval(() => {
        if (stack.length > 0) {
            let current = stack[stack.length - 1];
            let next = current.checkNeighbors();

            if (next) {
                next.visited = true;
                stack.push(next);
                removeWalls(current, next);
            } else {
                stack.pop();
            }
        } else {
            clearInterval(interval);
            // Maze generation is complete, now show the treasure and place Zelda
            showTreasure();
            placeZelda();  // Place Zelda at the entrance
        }
    }, 5);
}

// Function to show the treasure in the center of the maze
function showTreasure() {
    let centerRow = Math.floor(rows / 2);
    let centerCol = Math.floor(cols / 2);
    let treasureRoom = grid[centerRow][centerCol];
    treasureRoom.div.classList.add('treasure');
}

// Function to place Zelda at the entrance
function placeZelda() {
    if (zelda) {
        zelda.remove(); // Remove any existing Zelda to avoid duplicates
    }

    zelda = document.createElement('div');
    zelda.id = 'zelda';  // On utilise le style défini dans le CSS
    if (window.location.search.includes('fromLabyrinth=true')) {
        // Position initiale à Eldin après avoir quitté le labyrinthe
        zelda.style.top = '200px'; // Position correspondant à Eldin
        zelda.style.left = '450px';
    } else {
        // Position initiale à l'entrée
        zelda.style.top = '0px';
        zelda.style.left = '0px';
    }
    mazeContainer.appendChild(zelda);

    // Déplacer Zelda vers le trésor puis la sortie
    moveZeldaToTreasure();
}

function moveZeldaToTreasure() {
    let centerRow = Math.floor(rows / 2);
    let centerCol = Math.floor(cols / 2);

    findPathAndMove(0, 0, centerRow, centerCol, () => {
        alert("Zelda a trouvé le trésor !");
        moveZeldaToExit();
    });
}

function moveZeldaToExit() {
    let exitRow = rows - 1;
    let exitCol = cols - 1;

    findPathAndMove(Math.floor(rows / 2), Math.floor(cols / 2), exitRow, exitCol, () => {
        alert("Zelda a quitté le labyrinthe !");
        // Redirige vers la carte principale avec un paramètre pour indiquer que Zelda doit continuer vers le point 3
        window.location.href = '../laRoute/carte.html?fromLabyrinth=true&continueToPoint3=true';
    });
}

// Function to find the path using Depth First Search and move Zelda step by step
function findPathAndMove(startRow, startCol, targetRow, targetCol, callback) {
    let path = [];
    let visited = Array.from(Array(rows), () => Array(cols).fill(false));

    function dfs(row, col) {
        if (row < 0 || col < 0 || row >= rows || col >= cols) return false;
        if (visited[row][col] || grid[row][col].visited === false) return false;
        if (row === targetRow && col === targetCol) {
            path.push({ row, col });
            return true;
        }

        visited[row][col] = true;
        path.push({ row, col });

        // Visualiser les points de recherche en marquant chaque cellule visitée (ne pas marquer les points du chemin final)
        if (!(row === targetRow && col === targetCol)) {
            grid[row][col].div.classList.add('path');
        }

        // Explore les voisins (haut, droite, bas, gauche)
        if (row > 0 && !grid[row][col].walls[0] && dfs(row - 1, col)) return true; // Haut
        if (col < cols - 1 && !grid[row][col].walls[1] && dfs(row, col + 1)) return true; // Droite
        if (row < rows - 1 && !grid[row][col].walls[2] && dfs(row + 1, col)) return true; // Bas
        if (col > 0 && !grid[row][col].walls[3] && dfs(row, col - 1)) return true; // Gauche

        path.pop();
        return false;
    }

    if (dfs(startRow, startCol)) {
        moveZeldaAlongPath(path, callback);
    }
}

// Function to move Zelda along the calculated path
function moveZeldaAlongPath(path, callback) {
    let index = 0;

    let interval = setInterval(() => {
        if (index < path.length) {
            let { row, col } = path[index];

            // Si ce n'est pas la première étape, marquer la cellule précédente
            if (index > 0) {
                let previous = path[index - 1];
                grid[previous.row][previous.col].div.classList.add('trail');
            }

            // Déplacer Zelda à la cellule suivante
            zelda.style.top = `${row * 20}px`;
            zelda.style.left = `${col * 20}px`;

            index++;
        } else {
            // Marquer la dernière cellule lorsque Zelda arrive à destination
            if (index > 0) {
                let previous = path[index - 1];
                grid[previous.row][previous.col].div.classList.add('trail');
            }
            clearInterval(interval);
            if (callback) callback();
        }
    }, 200);
}

class Cell {
    constructor(row, col) {
        this.row = row;
        this.col = col;
        this.walls = [true, true, true, true]; // Haut, Droite, Bas, Gauche
        this.visited = false;

        this.div = document.createElement('div');
        this.div.classList.add('cell');
        this.div.style.top = `${this.row * 20}px`;
        this.div.style.left = `${this.col * 20}px`;
        mazeContainer.appendChild(this.div);
    }

    checkNeighbors() {
        let neighbors = [];

        let top = grid[this.row - 1] && grid[this.row - 1][this.col];
        let right = grid[this.row][this.col + 1];
        let bottom = grid[this.row + 1] && grid[this.row + 1][this.col];
        let left = grid[this.row][this.col - 1];

        if (top && !top.visited) neighbors.push(top);
        if (right && !right.visited) neighbors.push(right);
        if (bottom && !bottom.visited) neighbors.push(bottom);
        if (left && !left.visited) neighbors.push(left);

        if (neighbors.length > 0) {
            let r = Math.floor(Math.random() * neighbors.length);
            return neighbors[r];
        } else {
            return undefined;
        }
    }

    render() {
        if (this.visited) {
            this.div.classList.add('visited');
        } else {
            this.div.classList.remove('visited');
        }

        this.div.style.borderTop = this.walls[0] ? '1px solid black' : 'none';
        this.div.style.borderRight = this.walls[1] ? '1px solid black' : 'none';
        this.div.style.borderBottom = this.walls[2] ? '1px solid black' : 'none';
        this.div.style.borderLeft = this.walls[3] ? '1px solid black' : 'none';
    }
}

function removeWalls(a, b) {
    let x = a.col - b.col;
    if (x === 1) {
        a.walls[3] = false;
        b.walls[1] = false;
    } else if (x === -1) {
        a.walls[1] = false;
        b.walls[3] = false;
    }

    let y = a.row - b.row;
    if (y === 1) {
        a.walls[0] = false;
        b.walls[2] = false;
    } else if (y === -1) {
        a.walls[2] = false;
        b.walls[0] = false;
    }

    a.render();
    b.render();
}

setup();
