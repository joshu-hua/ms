import Cell from '@/components/Cell';
import { CellType, CellValue } from '@/types';
import { Box, Grid, Heading } from '@chakra-ui/react';
import React, { useState, useEffect } from 'react'

const Board = () => {

    const [grid, setGrid] = useState<CellType[][]>([]);
    const [difficulty, setDifficulty] = useState<'easy' | 'medium' | 'hard'>('medium');
    const [gameSettings, setGameSettings] = useState({
        rows: 10,
        cols: 10,
        mines: 10
    });
    const [isFirstClick, setIsFirstClick] = useState(true);

    useEffect(() => {
        // Define settings locally to avoid using stale state from gameSettings
        let currentSettings;
        if (difficulty === 'easy') {
            currentSettings = { rows: 10, cols: 10, mines: 10 };
        } else if (difficulty === 'medium') {
            currentSettings = { rows: 16, cols: 16, mines: 40 };
        } else { // 'hard'
            currentSettings = { rows: 16, cols: 30, mines: 99 };
        }
        setGameSettings(currentSettings);
        resetGame(currentSettings.rows, currentSettings.cols, currentSettings.mines);
    }, [difficulty]);

    const handleDifficultyChange = (newDifficulty: 'easy' | 'medium' | 'hard') => {
        setDifficulty(newDifficulty);
    }

    const resetGame = (rows: number, cols: number, mines: number) => {
        // 1. Initialize the grid
        const newGrid = Array.from({ length: rows }, (_, rowIndex) =>
            Array.from({ length: cols }, (_, colIndex) => ({
                isRevealed: false,
                isMine: false,
                isFlagged: false,
                adjacentMines: 0,
                value: CellValue.Empty,
                row: rowIndex,
                col: colIndex
            }))
        );

        // 2. Place mines directly on the newly created grid
        let placedMines = 0;
        while (placedMines < mines) {
            const row = Math.floor(Math.random() * rows);
            const col = Math.floor(Math.random() * cols);
            if (!newGrid[row][col].isMine) {
                newGrid[row][col].isMine = true;
                placedMines++;
            }
        }

        // calculating adjacent mines for each cell
        for (let row = 0; row < rows; row++) {
            for (let col = 0; col < cols; col++) {
                if (newGrid[row][col].isMine) continue;

                let mineCount = 0;
                // Check all 8 surrounding cells
                for (let r = -1; r <= 1; r++) {
                    for (let c = -1; c <= 1; c++) {
                        if (r === 0 && c === 0) continue; // Skip the cell itself
                        const newRow = row + r;
                        const newCol = col + c;
                        if (newRow >= 0 && newRow < rows && newCol >= 0 && newCol < cols) {
                            if (newGrid[newRow][newCol].isMine) {
                                mineCount++;
                            }
                        }
                    }
                }
                newGrid[row][col].value = mineCount;
            }
        }

        // 3. Set the final grid into state once
        setGrid(newGrid);
    }

    const handleReveal = (row: number, col: number) => {
        const newGrid = grid.map(row =>
            row.map(cell => ({ ...cell }))
        );

        function revealAdjacentCells(row: number, col: number) {
            for (let r = -1; r <= 1; r++) {
                for (let c = -1; c <= 1; c++) {
                    if (r === 0 && c === 0) continue;
                    const newRow = row + r;
                    const newCol = col + c;
                    if (newRow >= 0 && newRow < gameSettings.rows && newCol >= 0 && newCol < gameSettings.cols) {
                        const adjacentCell = newGrid[newRow][newCol];
                        if (!adjacentCell.isRevealed && !adjacentCell.isMine) {
                            adjacentCell.isRevealed = true;
                            if (adjacentCell.value === CellValue.Empty) {
                                revealAdjacentCells(newRow, newCol); // recursively reveal adjacent cells if they're empty
                            }
                        }
                    }
                }
            }

            setGrid(newGrid);
        }

        const cell = newGrid[row][col];
        if (cell.isRevealed || cell.isFlagged) return;

        cell.isRevealed = true;
        if (cell.value === CellValue.Empty && !cell.isMine) {
            // If the cell is empty, reveal adjacent cells
            revealAdjacentCells(row, col);
        }

        if (cell.isMine) {
            // TODO: don't 
            // Reveal all mines on the board
            newGrid.forEach(row => {
                row.forEach(cell => {
                    if (cell.isMine) {
                        cell.isRevealed = true;
                    }
                });
            });

            setGrid(newGrid);
            alert('Game Over! You hit a mine.');
            return;
        }

        setGrid(newGrid);
    }





    return (
        <>
            <Box>
                <Heading as="h1" size="2xl" mb={8}>
                    Minesweeper
                </Heading>
                <Grid templateColumns={`repeat(${gameSettings.cols}, 1fr)`} gap={1}>
                    {grid.map((row, rowIndex) =>
                        row.map((cell, colIndex) => (
                            <Cell
                                key={`${rowIndex}-${colIndex}`}
                                isMine={cell.isMine}
                                isRevealed={cell.isRevealed}
                                isFlagged={cell.isFlagged}
                                adjacentMines={cell.value}
                                onReveal={() => handleReveal(rowIndex, colIndex)}
                                onFlag={() => console.log('Flagging not implemented yet')}
                            />
                        ))
                    )}
                </Grid>
            </Box>
        </>
    )
}

export default Board