export enum CellValue {
	Empty = 0,
	One = 1,
	Two = 2,
	Three = 3,
	Four = 4,
	Five = 5,
	Six = 6,
	Seven = 7,
	Eight = 8,
	Mine,
}

export interface CellType {
	value: CellValue;
	isRevealed: boolean;
	isFlagged: boolean;
	isMine: boolean;
	row: number;
	col: number;
	highlighted?: boolean;
}

export enum GameStatus {
	Playing,
	Won,
	Lost,
}

export type Board = CellType[][];

export interface GameSettings {
	rows: number;
	cols: number;
	mines: number;
}
