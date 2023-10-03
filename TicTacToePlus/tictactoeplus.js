document.addEventListener("DOMContentLoaded", function (event) {
    run();
});
var outputConsole;
var playerXTurn = false;
var playerOTurn = true;
var playerWon = false;
var CellMeta = /** @class */ (function () {
    function CellMeta() {
        this.hasLetter = false;
    }
    return CellMeta;
}());
var Letter;
(function (Letter) {
    Letter["X"] = "X";
    Letter["O"] = "O";
})(Letter || (Letter = {}));
var Player = /** @class */ (function () {
    function Player(letter) {
        this.winner = false;
        this.placed = new Array();
        this.letter = letter;
    }
    return Player;
}());
var cellMap = new Map();
var players = new Map();
var gridElements = new Array();
var totalClickedCells = 0;
function newGame() {
    gridElements.forEach(function (element) {
        element.remove();
    });
    totalClickedCells = 0;
    players.clear();
    cellMap.clear();
    playerWon = false;
    run();
}
function run() {
    var gridElement = document.getElementById("grid");
    outputConsole = document.getElementById("console");
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
    for (var row = 0; row < buildRows; row++) {
        var rowEle = document.createElement("div");
        rowEle.id = "row_" + row;
        rowEle.classList.add("row");
        for (var col = 0; col < buildColumns; col++) {
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
            cellEle === null || cellEle === void 0 ? void 0 : cellEle.addEventListener('click', function handleClick(event) {
                console.log('Field clicked.');
                if (!playerWon) {
                    setLetter(event.target);
                }
            });
            rowEle.appendChild(cellEle);
            gridElements.push(cellEle);
        }
        gridElement === null || gridElement === void 0 ? void 0 : gridElement.appendChild(rowEle);
        gridElements.push(rowEle);
    }
}
function setLetter(clicked) {
    var clickedCell = cellMap.get(clicked.id);
    if (clickedCell.hasLetter) {
        console.log("Letter already placed!");
        outputConsole.value = "Letter already placed here!";
        return;
    }
    clickedCell.letter = playerXTurn ? Letter.X : Letter.O;
    clicked.textContent = clickedCell.letter;
    clickedCell.hasLetter = true;
    var player = players.get(clickedCell.letter);
    player.placed.push(clickedCell);
    outputConsole.value = "Player ".concat(player.letter, " placed a ").concat(player.letter, " at ").concat(clickedCell.cellX, ",").concat(clickedCell.cellY);
    playerXTurn = !playerXTurn;
    totalClickedCells++;
    checkWinner(player);
}
function checkWinner(player) {
    var xZeroCount = 0;
    var xOneCount = 0;
    var xTwoCount = 0;
    var yZeroCount = 0;
    var yOneCount = 0;
    var yTwoCount = 0;
    for (var _i = 0, _a = player.placed; _i < _a.length; _i++) {
        var placed = _a[_i];
        switch (placed.cellX) {
            case 0:
                xZeroCount++;
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
                yZeroCount++;
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
    }
    else if (xOneCount == 3) {
        player.winner = true;
    }
    else if (xTwoCount == 3) {
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
    var topLeft, topRight, center, bottomLeft, bottomRight = false;
    for (var _b = 0, _c = player.placed; _b < _c.length; _b++) {
        var placed = _c[_b];
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
        }
        else if (bottomLeft && topRight) {
            player.winner = true;
        }
    }
    if (player.winner) {
        outputConsole.value = "Player ".concat(player.letter.toString(), " wins!");
        playerWon = true;
    }
    else if (totalClickedCells == 9) {
        outputConsole.value = "Cat's game!";
    }
}
