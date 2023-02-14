import { CellMeta, Letter } from "./ClassMeta";

export class Player {
    winner: boolean = false;
    letter: Letter;
    placed: Array<CellMeta> = new Array<CellMeta>();
    constructor(letter: Letter) {
        this.letter = letter;
    }
}