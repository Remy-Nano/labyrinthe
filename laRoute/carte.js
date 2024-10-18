// Mise à jour de la fonction moveZeldaToExit dans labyrinthe.js
function moveZeldaToExit() {
    let exitRow = rows - 1;
    let exitCol = cols - 1;

    findPathAndMove(Math.floor(rows / 2), Math.floor(cols / 2), exitRow, exitCol, () => {
        alert("Zelda a quitté le labyrinthe !");
        // Redirige vers la carte principale avec un paramètre pour indiquer que Zelda doit continuer du point 2 au point 3
        window.location.href = '../laRoute/carteSortie.html';
    });
}

// Mise à jour de la fonction setup et autres dans labyrinthe.js
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
        window.location.href = '../laRoute/index.html?fromLabyrinth=true&continueToPoint3=true';
    });
}

// Mise à jour de carte.js
document.addEventListener('DOMContentLoaded', function() {
    const mapContainer = document.querySelector('.map-container');
    let scaleFactor = 1;

    function resizeMap() {
        mapContainer.style.transform = `scale(${scaleFactor})`;
        mapContainer.style.transformOrigin = 'center';
    }

    document.getElementById('map').addEventListener('click', function() {
        scaleFactor = scaleFactor === 1 ? 1.5 : 1;
        resizeMap();
    });

    const zelda = document.getElementById('zelda');

    function moveZelda(toX, toY, duration, callback) {
        zelda.style.transition = `all ${duration}s ease`;
        zelda.style.left = toX;
        zelda.style.top = toY;

        if (callback) {
            setTimeout(callback, duration * 1000);
        }
    }

    const urlParams = new URLSearchParams(window.location.search);
    const fromLabyrinth = urlParams.get('fromLabyrinth');
    const continueToPoint3 = urlParams.get('continueToPoint3');

    if (fromLabyrinth && continueToPoint3) {
        // Si Zelda revient du labyrinthe, commencez directement vers le point 3 (Faron)
        setTimeout(function() {
            moveZelda('50%', '80%', 3);
        }, 0);
    } else if (fromLabyrinth) {
        // Si Zelda revient du labyrinthe, commencez à partir du point 2 (Eldin) et continuez vers le point 3 (Faron)
        setTimeout(function() {
            moveZelda('45%', '20%', 3, function() {
                setTimeout(function() {
                    moveZelda('50%', '80%', 3);
                }, 0);
            });
        }, 0);
    } else {
        // Déplacer Zelda de Hebra à Eldin puis de Eldin à Faron
        setTimeout(function() {
            moveZelda('45%', '20%', 3, function() {
                // Lorsque Zelda arrive à Eldin, redirigez vers le labyrinthe
                window.location.href = '../laRoute/labyrinthe/labyrinthe.html';
            });
        }, 0);
    }
});
