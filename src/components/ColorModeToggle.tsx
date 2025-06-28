import { Button, useColorMode, useColorModeValue } from '@chakra-ui/react'
import React from 'react'

const ColorModeToggle = () => {
    const { colorMode, toggleColorMode } = useColorMode()

    // Use different icons/text based on current mode
    const buttonText = useColorModeValue('🌙', '☀️')
    const buttonBg = useColorModeValue('gray.200', 'gray.600')

    return (
        <>
            <Button
                onClick={toggleColorMode}
                bg={buttonBg}
                size="sm"
                _hover={{
                    transform: 'scale(1.05)',
                }}
                transition="all 0.2s"
            >
                {buttonText}
            </Button>
        </>
    )
}

export default ColorModeToggle
