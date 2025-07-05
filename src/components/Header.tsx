import { Box, Flex, Heading, Link } from '@chakra-ui/react'
import React from 'react'
import ColorModeToggle from './ColorModeToggle'


const Header = () => {
    return (
        <Box bg="surface-bg" borderBottom="1px" borderColor="border-color" py={4} px={6}>
            <Flex justify="space-between" align="center" maxW="1200px" mx="auto">
                <Link href="/" _hover={{ textDecoration: 'none', transform: 'scale(1.05)' }} transition="all 0.2s"
                >
                    <Heading size="lg" color="text-primary" fontWeight="bold">
                        💣
                    </Heading>
                </Link>
                <Flex gap={4} align="center">
                    <Link href="userauth" color={"text-link"} _hover={{ textDecoration: 'underline' }}>
                        Login/Register
                    </Link>
                    <ColorModeToggle />
                </Flex>
            </Flex>
        </Box>
    )
}

export default Header