import { Box, Flex, Heading, Link } from '@chakra-ui/react'
import React from 'react'
import ColorModeToggle from './ColorModeToggle'

const Header = () => {
    return (
        <Box bg="surface-bg" borderBottom="1px" borderColor="border-color" py={4} px={6}>
            <Flex justify="space-between" align="center" maxW="1200px" mx="auto">
                <a href="/">
                    <Heading size="lg" color="text-primary" fontWeight="bold">
                        💣
                    </Heading>
                </a>
                <Flex gap={4} align="center">
                    <Link href="login" color={"text-link"} _hover={{ textDecoration: 'underline' }}>
                        Login/Signup
                    </Link>
                    <ColorModeToggle />
                </Flex>
            </Flex>
        </Box>
    )
}

export default Header