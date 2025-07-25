import Cell from '@/components/Cell';
import { CellType, CellValue, CreateScoreRequest, UpdateStatsRequest } from '@/types';
import {
    AlertDialog,
    AlertDialogBody,
    AlertDialogContent,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogOverlay,
    Box,
    Button,
    Flex,
    Grid,
    Heading,
    Select,
    useDisclosure
} from '@chakra-ui/react';
import React, { useState, useEffect, useRef } from 'react'
import { useGameTimer } from '@/hooks/useGameTimer';
import { createScore, updateUserStats } from '@/lib/api';

const Board = () => {
    const { time, formattedTime, startTimer, stopTimer, resetTimer } = useGameTimer();
    const [grid, setGrid] = useState<CellType[][]>([]);
    const [difficulty, setDifficulty] = useState<'easy' | 'medium' | 'hard'>('easy');
    const [gameSettings, setGameSettings] = useState({
        rows: 10,
        cols: 10,
        mines: 10
    });
    const [isFirstClick, setIsFirstClick] = useState(true);
    const [gameState, setGameState] = useState<'playing' | 'won' | 'lost'>('playing');
    const [flags, setFlags] = useState<number>(0);

    // For the AlertDialog
    const { isOpen, onOpen, onClose } = useDisclosure();
    const cancelRef = useRef<HTMLButtonElement>(null);

    useEffect(() => { // save score and stats when game ends
        if (gameState !== 'playing') {
            if (gameState === 'won') {
                const saveScore = async () => {
                    try {
                        const scoreData: CreateScoreRequest = {
                            time,
                            difficulty,
                            gridSize: `${gameSettings.rows}x${gameSettings.cols}`,
                            mines: gameSettings.mines
                        };

                        const result = await createScore(scoreData);

                        if (result.success) {
                            console.log("Score saved successfully:", result);
                        } else {
                            console.error("Failed to save score:", result.message);
                        }

                    } catch (error) {
                        console.error("Error saving score:", error);
                    }

                };

                saveScore();
            }

            const updateStats = async () => {
                try {
                    const stats: UpdateStatsRequest = {
                        difficulty,
                        completed: gameState === 'won'
                    };

                    const result = await updateUserStats(stats);

                    if (result.success) {
                        console.log("User stats updated successfully:", result);
                    } else {
                        console.error("Failed to update user stats:", result.message);
                    }

                } catch (error) {
                    console.error("Error updating user stats:", error);
                }

            };
            updateStats();

        }




    }, [gameState]); // eslint-disable-line react-hooks/exhaustive-deps

    // Load difficulty from localStorage on component mount
    useEffect(() => {
        if (typeof window !== "undefined") {
            const savedDifficulty = localStorage.getItem('minesweeper-difficulty');
            if (savedDifficulty && ['easy', 'medium', 'hard'].includes(savedDifficulty)) {
                setDifficulty(savedDifficulty as 'easy' | 'medium' | 'hard');
            }
        }
    }, []);

    useEffect(() => {
        // Set game settings based on difficulty
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
    }, [difficulty]); // eslint-disable-line react-hooks/exhaustive-deps

    // Open dialog when game ends
    useEffect(() => {
        if (gameState === 'won' || gameState === 'lost') {
            onOpen();
        }
    }, [gameState, onOpen]);

    // Prevent context menu when dialog is open
    useEffect(() => {
        const handleContextMenu = (e: MouseEvent) => {
            if (isOpen) {
                e.preventDefault();
            }
        };

        document.addEventListener('contextmenu', handleContextMenu);

        return () => {
            document.removeEventListener('contextmenu', handleContextMenu);
        };
    }, [isOpen]);

    const handleDifficultyChange = (newDifficulty: 'easy' | 'medium' | 'hard') => {
        setDifficulty(newDifficulty);

        // Save difficulty to localStorage
        if (typeof window !== "undefined") {
            localStorage.setItem('minesweeper-difficulty', newDifficulty);
        }
    }

    const resetGame = (rows: number, cols: number, mines: number) => {
        // 1. Initialize a blank grid without mines
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
        // 2. Reset first click status
        setIsFirstClick(true);
        // 3. Reset game state
        setGameState('playing');
        // 4. Close dialog if open
        onClose();
        // 5. Set the blank grid
        setGrid(newGrid);
        // 6. Reset timer
        resetTimer();
        // 7. Reset flags count
        setFlags(mines);
    }

    const handlePlayAgain = () => {
        resetGame(gameSettings.rows, gameSettings.cols, gameSettings.mines);
    }

    const handleReveal = (row: number, col: number) => {
        // Don't allow reveals if game is over
        if (gameState !== 'playing') return;

        const startTime = performance.now();
        let gridToProcess = grid;

        if (isFirstClick) {
            startTimer();
            setIsFirstClick(false);
            const newGrid = grid.map(r => r.map(c => ({ ...c })));

            // Place mines, avoiding the first click area
            let placedMines = 0;
            while (placedMines < gameSettings.mines) {
                const r = Math.floor(Math.random() * gameSettings.rows);
                const c = Math.floor(Math.random() * gameSettings.cols);
                const isSafeZone = Math.abs(r - row) <= 1 && Math.abs(c - col) <= 1;
                if (!isSafeZone && !newGrid[r][c].isMine) {
                    newGrid[r][c].isMine = true;
                    placedMines++;
                }
            }

            // Calculate adjacent mine counts
            for (let r = 0; r < gameSettings.rows; r++) {
                for (let c = 0; c < gameSettings.cols; c++) {
                    if (newGrid[r][c].isMine) continue;
                    let mineCount = 0;
                    for (let dr = -1; dr <= 1; dr++) {
                        for (let dc = -1; dc <= 1; dc++) {
                            if (dr === 0 && dc === 0) continue;
                            const nr = r + dr;
                            const nc = c + dc;
                            if (nr >= 0 && nr < gameSettings.rows && nc >= 0 && nc < gameSettings.cols && newGrid[nr][nc].isMine) {
                                mineCount++;
                            }
                        }
                    }
                    newGrid[r][c].value = mineCount;
                }
            }
            gridToProcess = newGrid;
        }

        const finalGrid = revealCell(gridToProcess, row, col);

        // Check game state after revealing
        const newGameState = checkGameState(finalGrid);
        setGameState(newGameState);

        setGrid(finalGrid);

        const endTime = performance.now();
        if (endTime - startTime > 50) {
            console.log(`handleReveal took ${endTime - startTime}ms`);
        }
    };

    const revealCell = (grid: CellType[][], row: number, col: number): CellType[][] => {
        // Create a shallow copy of the grid array, but reuse cell objects that don't change
        const newGrid = grid.map(r => [...r]);
        const cell = newGrid[row][col];

        if (cell.isRevealed || cell.isFlagged) {
            return newGrid; // Return the grid unmodified
        }

        // Use a queue for an iterative flood fill
        const queue: { row: number, col: number }[] = [{ row, col }];
        const cellsToUpdate = new Set<string>(); // Track which cells need updating

        // Mark the initial cell for update
        cellsToUpdate.add(`${row}-${col}`);
        newGrid[row][col] = { ...cell, isRevealed: true };

        // If the first revealed cell is a mine, end the game
        if (cell.isMine) {
            newGrid.forEach((r, rowIndex) => r.forEach((c, colIndex) => {
                if (c.isMine) {
                    const key = `${rowIndex}-${colIndex}`;
                    if (!cellsToUpdate.has(key)) {
                        cellsToUpdate.add(key);
                        newGrid[rowIndex][colIndex] = { ...c, isRevealed: true };
                    }
                }
            }));
            return newGrid;
        }

        while (queue.length > 0) {
            const current = queue.shift()!;
            const currentCell = newGrid[current.row][current.col];

            // If the current cell is empty, reveal its neighbors
            if (currentCell.value === CellValue.Empty) {
                for (let dr = -1; dr <= 1; dr++) {
                    for (let dc = -1; dc <= 1; dc++) {
                        if (dr === 0 && dc === 0) continue;
                        const nr = current.row + dr;
                        const nc = current.col + dc;

                        if (nr >= 0 && nr < gameSettings.rows && nc >= 0 && nc < gameSettings.cols) {
                            const neighbor = newGrid[nr][nc];
                            const key = `${nr}-${nc}`;

                            if (!neighbor.isRevealed && !neighbor.isFlagged && !cellsToUpdate.has(key)) {
                                cellsToUpdate.add(key);
                                newGrid[nr][nc] = { ...neighbor, isRevealed: true };

                                // If the neighbor is also empty, add it to the queue to be processed
                                if (neighbor.value === CellValue.Empty) {
                                    queue.push({ row: nr, col: nc });
                                }
                            }
                        }
                    }
                }
            }
        }

        return newGrid;
    };

    const handleFlag = (row: number, col: number) => {
        // Don't allow flagging if game is over
        if (gameState !== 'playing') return;

        const newGrid = [...grid];
        const cell = newGrid[row][col];
        if (cell.isRevealed) return; // Can't flag a revealed cell

        // Only update the specific cell that changed
        newGrid[row] = [...newGrid[row]];
        newGrid[row][col] = { ...cell, isFlagged: !cell.isFlagged };

        // Update flags count
        if (!cell.isFlagged) {
            setFlags(flags - 1);
        } else {
            setFlags(flags + 1);
        }

        setGrid(newGrid);
    }

    const handleChord = (row: number, col: number) => {
        // Don't allow chording if game is over
        if (gameState !== 'playing') return;

        let newGrid = grid.map(row =>
            row.map(cell => ({ ...cell }))
        );

        const cell = newGrid[row][col];
        if (!cell.isRevealed || cell.isFlagged || (cell.value == CellValue.Empty)) return; // Can't chord on unrevealed or flagged or empty cells

        let adjacentFlags = 0;
        for (let dr = -1; dr <= 1; dr++) {
            for (let dc = -1; dc <= 1; dc++) {
                if (dr === 0 && dc === 0) continue;
                const nr = row + dr;
                const nc = col + dc;
                if (nr >= 0 && nr < gameSettings.rows && nc >= 0 && nc < gameSettings.cols) {
                    const neighbor = newGrid[nr][nc];
                    if (neighbor.isFlagged) {
                        adjacentFlags++;
                    }
                }
            }
        }

        if (adjacentFlags === cell.value) {
            // If the number of adjacent flags matches the cell's value, reveal all adjacent unrevealed cells
            for (let dr = -1; dr <= 1; dr++) {
                for (let dc = -1; dc <= 1; dc++) {
                    if (dr === 0 && dc === 0) continue;
                    const nr = row + dr;
                    const nc = col + dc;
                    if (nr >= 0 && nr < gameSettings.rows && nc >= 0 && nc < gameSettings.cols) {
                        const neighbor = newGrid[nr][nc];
                        if (!neighbor.isRevealed && !neighbor.isFlagged) {
                            // If the neighbor is empty, reveal its neighbors as well
                            newGrid = revealCell(newGrid, nr, nc);
                        }
                    }
                }
            }

            // Check game state after chording
            const newGameState = checkGameState(newGrid);
            setGameState(newGameState);

        }

        setGrid(newGrid);
    }

    const checkGameState = (grid: CellType[][]): 'playing' | 'won' | 'lost' => {
        // Check if any mine is revealed (game lost)
        for (let r = 0; r < gameSettings.rows; r++) {
            for (let c = 0; c < gameSettings.cols; c++) {
                if (grid[r][c].isMine && grid[r][c].isRevealed) {
                    stopTimer();
                    return 'lost';
                }
            }
        }

        // Check if all non-mine cells are revealed (game won)
        let unrevealedNonMines = 0;
        for (let r = 0; r < gameSettings.rows; r++) {
            for (let c = 0; c < gameSettings.cols; c++) {
                if (!grid[r][c].isMine && !grid[r][c].isRevealed) {
                    unrevealedNonMines++;
                }
            }
        }

        if (unrevealedNonMines === 0) {
            stopTimer();
            return 'won';
        }

        return 'playing';
    };

    return (
        <>
            <Box bg="app-bg">
                <Flex mb={4} justifyContent="space-evenly" alignItems="center" gap={8}>
                    <Select value={difficulty} onChange={(e) => handleDifficultyChange(e.target.value as 'easy' | 'medium' | 'hard')}>
                        <option value="easy">Easy</option>
                        <option value="medium">Medium</option>
                        <option value="hard">Hard</option>
                    </Select>
                </Flex>
                <Flex mb={4} justifyContent="space-evenly" alignItems="center" bg="panel-bg" p={4} borderRadius='md'>
                    <Heading size="md" color="text-primary">
                        🚩{` ${flags}`}
                    </Heading>
                    <Button ml={4} colorScheme="red" variant="outline" onClick={() => resetGame(gameSettings.rows, gameSettings.cols, gameSettings.mines)}>
                        Restart
                    </Button>
                    <Heading size="md" ml={4} color="text-primary">
                        {`${time}s (${formattedTime})`}
                    </Heading>
                </Flex>


                <Grid templateColumns={`repeat(${gameSettings.cols}, 1fr)`} gap={'0px'} border={'1px solid rgb(141, 140, 155)'}>
                    {grid.map((row, rowIndex) =>
                        row.map((cell, colIndex) => (
                            <Cell
                                key={`${rowIndex}-${colIndex}`}
                                isMine={cell.isMine}
                                isRevealed={cell.isRevealed}
                                isFlagged={cell.isFlagged}
                                adjacentMines={cell.value}
                                onReveal={() => handleReveal(rowIndex, colIndex)}
                                onFlag={() => handleFlag(rowIndex, colIndex)}
                                onChord={() => handleChord(rowIndex, colIndex)}
                                onR={() => resetGame(gameSettings.rows, gameSettings.cols, gameSettings.mines)}
                            />
                        ))
                    )}
                </Grid>

                {/* Game End AlertDialog */}
                <AlertDialog
                    isOpen={isOpen}
                    leastDestructiveRef={cancelRef}
                    onClose={onClose}
                    isCentered
                    closeOnOverlayClick={false}
                >
                    <AlertDialogOverlay>
                        <AlertDialogContent>
                            <AlertDialogHeader fontSize='lg' fontWeight='bold'>
                                {gameState === 'won' ? '🎊 You Won!' : '💥 Game Over!'}
                            </AlertDialogHeader>

                            <AlertDialogBody>
                                {gameState === 'won'
                                    ? `Time: ${time}s`
                                    : `Time: --`}
                            </AlertDialogBody>

                            <AlertDialogFooter>
                                <Button ref={cancelRef} onClick={onClose}>
                                    Close
                                </Button>
                                <Button
                                    colorScheme={gameState === 'won' ? 'green' : 'blue'}
                                    onClick={handlePlayAgain}
                                    ml={3}
                                >
                                    Play Again
                                </Button>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialogOverlay>
                </AlertDialog>
            </Box >
        </>
    )
}

export default Board