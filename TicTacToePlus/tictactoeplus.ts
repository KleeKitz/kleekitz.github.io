
document.addEventListener("DOMContentLoaded", function (event) {
    run();
})

var outputConsole: HTMLInputElement;

var playerXTurn: boolean = false;
var playerOTurn: boolean = true;
var playerWon: boolean = false;

class CellMeta {
    id: string;
    letter: Letter;
    cellX: number;
    cellY: number;

    hasLetter: boolean = false;
}

enum Letter {
    X = "X",
    O = "O"
}

class Player {
    winner: boolean = false;
    letter: Letter;
    placed: Array<CellMeta> = new Array<CellMeta>();
    constructor(letter: Letter) {
        this.letter = letter;
    }
}

var cellMap = new Map<string, CellMeta>();

var players = new Map<Letter, Player>();

var gridElements = new Array();
var totalClickedCells = 0;

function newGame() {
    gridElements.forEach(element => {
        element.remove();
    })
    totalClickedCells = 0;
    players.clear();
    cellMap.clear();
    playerWon = false;
    run();
}


function run() {
    const gridElement = document.getElementById("grid");

    outputConsole = document.getElementById("console") as HTMLInputElement;
    outputConsole.value = "";

    players.set(Letter.X, new Player(Letter.X));
    players.set(Letter.O, new Player(Letter.O));

    /*
    <div id="grid_0_0" class="row">
                <div id="col_0" class="col">
                    <div id="row_0" class="row">
                        <div id="cell_0_0" class="col">0,0</div>
    */

    /*
    
           col col col
           1   2   3
          +---+---+---+
    Row1  |   |   |   |
          +---+---+---+
    Row2  |   |   |   |
          +---+---+---+
    Row3  |   |   |   |
          +---+---+---+

    */

    var buildColumns = 3;
    var buildRows = 3;

    for (let row = 0; row < buildRows; row++) {

        var rowEle = document.createElement("div");
        rowEle.id = "row_" + row;
        rowEle.classList.add("row");

        for (let col = 0; col < buildColumns; col++) {

            var cellEle = document.createElement("div");
            cellEle.id = "cell_" + row + "_" + col;
            cellEle.classList.add("col-sm");
            cellEle.classList.add("cell");
            cellEle.classList.add("align-middle");

            var cell = new CellMeta();
            cell.id = cellEle.id;
            cell.cellX = col;
            cell.cellY = row;

            cellMap.set(cellEle.id, cell);

            cellEle?.addEventListener('click', function handleClick(event) {
                console.log('Field clicked.');
                if (!playerWon) {
                    setLetter(event.target as Element);
                }
            });

            rowEle.appendChild(cellEle);
            gridElements.push(cellEle);

        }

        gridElement?.appendChild(rowEle);
        gridElements.push(rowEle);

    }

}

function setLetter(clicked: Element) {
    var clickedCell: CellMeta = cellMap.get(clicked.id);

    if (clickedCell.hasLetter) {
        console.log("Letter already placed!");
        outputConsole.value = "Letter already placed here!"
        return;
    }

    clickedCell.letter = playerXTurn ? Letter.X : Letter.O;
    clicked.textContent = clickedCell.letter;
    clickedCell.hasLetter = true;

    var player = players.get(clickedCell.letter);
    player.placed.push(clickedCell);

    outputConsole.value = `Player ${player.letter} placed a ${player.letter} at ${clickedCell.cellX},${clickedCell.cellY}`;

    playerXTurn = !playerXTurn;

    totalClickedCells++;

    checkWinner(player);
}

function checkWinner(player: Player) {

    var xZeroCount = 0;
    var xOneCount = 0;
    var xTwoCount = 0;

    var yZeroCount = 0;
    var yOneCount = 0;
    var yTwoCount = 0;

    for (const placed of player.placed) {
        switch (placed.cellX) {
            case 0:
                xZeroCount++
                break;
            case 1:
                xOneCount++;
                break;
            case 2:
                xTwoCount++;
            default:
                break;
        }
        switch (placed.cellY) {
            case 0:
                yZeroCount++
                break;
            case 1:
                yOneCount++;
                break;
            case 2:
                yTwoCount++;
            default:
                break;
        }
    }

    if (xZeroCount == 3) {
        player.winner = true;
    } else if (xOneCount == 3) {
        player.winner = true;
    } else if (xTwoCount == 3) {
        player.winner = true;
    }

    /*

    0,0 - 0,1 - 0,2
    1,0 - 1,1 - 1,2
    2,0 - 2,1 - 2,2

    0,0 + 0,1 + 0,2
    0,0 + 1,1 + 2,2
    0,0 + 1,0 + 2,0

    0,1 + 1,1 + 2,1

    0,2 + 1,2 + 2,2
    0,2 + 1,1 + 2,0

    1,0 + 1,1 + 1,2

    2,0 + 2,1 + 2,2

    */

    var topLeft, topRight, center, bottomLeft, bottomRight: boolean = false;


    for (const placed of player.placed) {
        if (placed.cellX == 0 && placed.cellY == 0) {
            topLeft = true;
        }
        if (placed.cellX == 1 && placed.cellY == 1) {
            center = true;
        }
        if (placed.cellX == 2 && placed.cellY == 2) {
            bottomRight = true;
        }
        if (placed.cellX == 2 && placed.cellY == 0) {
            bottomLeft = true;
        }
        if (placed.cellX == 0 && placed.cellY == 2) {
            topRight = true;
        }
    }

    if (center) {
        if (topLeft && bottomRight) {
            player.winner = true;
        } else if (bottomLeft && topRight) {
            player.winner = true;
        }
    }

    if (player.winner) {
        outputConsole.value = `Player ${player.letter.toString()} wins!`;
        playerWon = true;
    } else if (totalClickedCells == 9) {
        outputConsole.value = "Cat's game!";
    }

}

