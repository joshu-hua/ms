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

// Database types for user authentication and scores
export interface User {
	id: number;
	username: string;
	email: string;
	createdAt: Date;
	updatedAt: Date;
}

export interface CreateUserRequest {
	username: string;
	email: string;
	password: string;
}

export interface LoginRequest {
	email: string;
	password: string;
}

export interface Score {
	id: number;
	userId: number;
	time: number;
	difficulty: string;
	gridSize: string;
	mines: number;
	createdAt: Date;
	user?: User; // Optional user data when fetching scores
}

export interface CreateScoreRequest {
	time: number;
	difficulty: string;
	gridSize: string;
	mines: number;
}

export interface CreateScoreResponse {
	success: boolean;
	message: string;
	score?: Score; // The created score with ID, timestamps, etc.
}

export interface UpdateStatsRequest {
	difficulty: string;
	completed: boolean;
}

export interface UserStats {
	id: number;
	userId: number;
	difficulty: string;
	totalGames: number;
	totalWins: number;
	lastPlayed: Date;
}

export interface UserStatsResponse {
	success: boolean;
	message: string;
	stats?: UserStats; // The user stats object
}

export interface AuthResponse {
	success: boolean;
	message: string;
	user?: User;
	token?: string;
}
