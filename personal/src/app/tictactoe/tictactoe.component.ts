import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormControl, FormsModule, NgModel, ReactiveFormsModule } from '@angular/forms';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { CellMeta, Letter } from './interface/ClassMeta';
import { Player } from './interface/Player';

@Component({
  selector: 'app-tictactoe',
  templateUrl: './tictactoe.component.html',
  styleUrls: ['./tictactoe.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class TictactoeComponent implements OnInit {

  scriptElement!: HTMLScriptElement;
  playerXFirst: boolean = true;
  formControl = new FormControl('x');

  constructor() { }

  ngOnInit(): void {
    this.run();
  }

  outputConsole!: HTMLInputElement;

  playerXTurn: boolean = true;
  playerOTurn: boolean = false;
  playerWon: boolean = false;

  cellMap = new Map<string, CellMeta>();

  players = new Map<Letter, Player>();

  gridElements = new Array();
  totalClickedCells = 0;

  public newGame() {
    this.gridElements.forEach(element => {
      element.remove();
    })
    this.totalClickedCells = 0;
    this.players.clear();
    this.cellMap.clear();
    this.playerWon = false;
    this.checkWhoGoesFirst();
    this.run();
  }


  run() {
    this.checkWhoGoesFirst();
    const gridElement = document.getElementById("grid");

    this.outputConsole = document.getElementById("console") as HTMLInputElement;
    this.outputConsole.value = "";

    this.players.set(Letter.X, new Player(Letter.X));
    this.players.set(Letter.O, new Player(Letter.O));

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

        this.cellMap.set(cellEle.id, cell);

        cellEle?.addEventListener('click', (evt) => this.handleClick(evt));

        rowEle.appendChild(cellEle);
        this.gridElements.push(cellEle);

      }

      gridElement?.appendChild(rowEle);
      this.gridElements.push(rowEle);

    }

  }

  handleClick(mouseEvent: MouseEvent) {
    console.log("Field clicked!");
    if (!this.playerWon) {
      this.setLetter((mouseEvent.target as Element));
    }
  }

  setLetter(clicked: Element) {

    if (this.totalClickedCells == 0) {
      this.checkWhoGoesFirst();
    }

    var clickedCell: CellMeta = this.cellMap.get(clicked.id)!;

    if (clickedCell.hasLetter) {
      console.log("Letter already placed!");
      this.outputConsole.value = "Letter already placed here!"
      return;
    }

    clickedCell.letter = this.playerXTurn ? Letter.X : Letter.O;
    clicked.textContent = clickedCell.letter;
    clickedCell.hasLetter = true;

    var player = this.players.get(clickedCell.letter);
    if (!player) {
      return;
    }
    player.placed.push(clickedCell);

    this.outputConsole.value = `Player ${player.letter} placed a ${player.letter} at ${clickedCell.cellX},${clickedCell.cellY}`;

    this.playerXTurn = !this.playerXTurn;

    this.totalClickedCells++;

    this.checkWinner(player);

  }

  checkWinner(player: Player) {

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
          break;
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
          break;
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

    if (yZeroCount == 3) {
      player.winner = true;
    } else if (yOneCount == 3) {
      player.winner = true;
    } else if (yTwoCount == 3) {
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
      this.outputConsole.value = `Player ${player.letter.toString()} wins!`;
      this.playerWon = true;
    } else if (this.totalClickedCells == 9) {
      this.outputConsole.value = "Cat's game!";
    }

  }

  setPlayerXTurn(isXTurn: boolean) {
    console.log("Setting player x turn to " + isXTurn);
    if (isXTurn) {
      this.playerXTurn = true;
      this.playerOTurn = false;
    } else {
      this.playerOTurn = true;
      this.playerXTurn = false;
    }
  }

  checkWhoGoesFirst() {

    if (this.formControl.value?.match("x")) {
      this.playerXFirst = true;
      this.playerXTurn = true;
      this.playerOTurn = false;
    } else {
      this.playerXFirst = false;
      this.playerXTurn = false;
      this.playerOTurn = true;
    }
  }
}
