import Cell from '@/components/Cell';
import { CellType, CellValue } from '@/types';
import {
    Alert,
    AlertDialog,
    AlertDialogBody,
    AlertDialogContent,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogOverlay,
    AlertIcon,
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

const Board = () => {
    const { time, formattedTime, startTimer, stopTimer, resetTimer, isRunning } = useGameTimer();
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

        let gridToProcess = grid;

        if (isFirstClick) {
            startTimer();
            setIsFirstClick(false);
            let newGrid = grid.map(r => r.map(c => ({ ...c })));

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
    };

    const revealCell = (grid: CellType[][], row: number, col: number): CellType[][] => {
        let newGrid = grid.map(r => r.map(c => ({ ...c })));
        const cell = newGrid[row][col];

        if (cell.isRevealed || cell.isFlagged) {
            return newGrid; // Return the grid unmodified
        }

        // Use a queue for an iterative flood fill
        const queue: { row: number, col: number }[] = [{ row, col }];
        newGrid[row][col].isRevealed = true;

        // If the first revealed cell is a mine, end the game
        if (cell.isMine) {
            newGrid.forEach(r => r.forEach(c => {
                if (c.isMine) c.isRevealed = true;
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
                            if (!neighbor.isRevealed && !neighbor.isFlagged) {
                                neighbor.isRevealed = true;
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

        const newGrid = grid.map(row =>
            row.map(cell => ({ ...cell }))
        );

        const cell = newGrid[row][col];
        if (cell.isRevealed) return; // Can't flag a revealed cell

        cell.isFlagged = !cell.isFlagged; // Toggle flag state

        // Update flags count
        if (cell.isFlagged) {
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

        } else {
            console.log("should highlight adjacent cells that are unrevealed and not flagged");
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
            <Box>
                <Flex mb={4} justifyContent="space-evenly" alignItems="center">
                    <Select value={difficulty} onChange={(e) => handleDifficultyChange(e.target.value as 'easy' | 'medium' | 'hard')}>
                        <option value="easy">Easy</option>
                        <option value="medium">Medium</option>
                        <option value="hard">Hard</option>
                    </Select>
                </Flex>
                <Flex mb={4} justifyContent="space-evenly" alignItems="center" bg={'gray.100'} p={4} borderRadius='md'>
                    <Heading size="md">
                        🚩{` ${flags}`}
                    </Heading>
                    <Button ml={4} colorScheme="blue" variant="ghost" onClick={() => resetGame(gameSettings.rows, gameSettings.cols, gameSettings.mines)}>
                        Reset
                    </Button>
                    <Heading size="md" ml={4}>
                        {formattedTime}
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
                                    ? `Time: ${formattedTime}`
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