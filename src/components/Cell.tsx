import { Box } from '@chakra-ui/react';
import React, { useRef } from 'react'

interface CellProps {
    isMine: boolean;
    isRevealed: boolean;
    isFlagged: boolean;
    adjacentMines: number;
    onReveal: () => void;
    onFlag: () => void;
    onChord: () => void;
    onR: () => void; // Reset function
}

const Cell = ({ isMine, isRevealed, isFlagged, adjacentMines, onReveal, onFlag, onChord, onR }: CellProps) => {
    const cellRef = useRef<HTMLButtonElement>(null);

    const handleMouseDown = (e: React.MouseEvent) => {
        if (e.buttons === 3 || e.button === 1) {
            e.preventDefault();
            onChord();
        }
    }

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === ' ' || e.code === 'Space') {
            e.preventDefault(); // Prevent page scrolling
            if (isRevealed) {
                // If cell is revealed, chord
                onChord();
            } else {
                // If cell is unrevealed, flag/unflag
                onFlag();
            }
        } else if (e.key === 'r' || e.code === 'KeyR') {
            e.preventDefault();
            onR(); // Call reset function
        }
    }

    const handleMouseEnter = () => {
        // Focus the cell when mouse enters
        if (cellRef.current) {
            cellRef.current.focus();
        }
    }

    return (
        <>
            <Box
                ref={cellRef}
                as="button"
                cursor={'default'}
                onClick={onReveal}
                onKeyDown={handleKeyDown}
                onMouseEnter={handleMouseEnter}
                tabIndex={0} // Make focusable for keyboard events
                onContextMenu={(e: { preventDefault: () => void; }) => {
                    e.preventDefault();
                    onFlag(); // Call flag function
                }}
                onMouseDown={handleMouseDown}
                w="40px"
                h="40px"
                {...(isRevealed ? { bg: 'gray.400', border: '1px solid rgb(141, 140, 155)' } : { bg: 'gray.200', border: '1px solid rgb(170, 168, 190)' })}
                _hover={!isRevealed ? { bg: 'gray.300' } : {}}
                _focus={{
                    outline: '2px solid',
                    outlineColor: 'blue.200',
                    outlineOffset: '-2px'
                }}
            >
                {isRevealed ? (
                    isMine ? (
                        '💣' // Display mine
                    ) : (
                        adjacentMines > 0 ? (
                            <span className={`mine-count-${adjacentMines}`}>{adjacentMines}</span> // Display number of adjacent mines
                        ) : (
                            ' ' // Empty cell
                        )
                    )
                ) : (
                    isFlagged ? (
                        '🚩' // Display flag
                    ) : (
                        ' ' // Hidden cell
                    )
                )}

            </Box>
        </>
    )
}

export default Cell