import { Box } from '@chakra-ui/react';
import React, { useState } from 'react'
import type { Cell } from '@/types';

interface CellProps {
    isMine: boolean;
    isRevealed: boolean;
    isFlagged: boolean;
    adjacentMines: number;
    onReveal: () => void;
    onFlag: () => void;
}

const Cell = ({ isMine, isRevealed, isFlagged, adjacentMines, onReveal, onFlag }: CellProps) => {
    return (
        <>
            <Box
                as="button"
                cursor={'default'}
                onClick={onReveal}
                onContextMenu={(e: { preventDefault: () => void; }) => {
                    e.preventDefault();
                    onFlag(); // Call flag function
                }}
                w="40px"
                h="40px"
                {...(isRevealed ? { bg: 'gray.300' } : { bg: 'gray.200' })}
                _hover={!isRevealed ? { bg: 'gray.300' } : {}}
            >
                {isRevealed ? (
                    isMine ? (
                        '💣' // Display mine
                    ) : (
                        adjacentMines > 0 ? (
                            adjacentMines // Display number of adjacent mines
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