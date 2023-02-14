export class CellMeta {
    id!: string;
    letter!: Letter;
    cellX!: number;
    cellY!: number;

    hasLetter: boolean = false;

}
export enum Letter {
    X = "X",
    O = "O"
}