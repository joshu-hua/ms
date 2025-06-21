export enum CellValue {
	Empty = 0,
	One,
	Two,
	Three,
	Four,
	Five,
	Six,
	Seven,
	Eight,
	Mine,
}

export interface Cell {
	value: CellValue;
	isRevealed: boolean;
	isFlagged: boolean;
	row: number;
	col: number;
}

export enum GameStatus {
	Playing,
	Won,
	Lost,
}

export type Board = Cell[][];

export interface GameSettings {
	rows: number;
	cols: number;
	mines: number;
}
