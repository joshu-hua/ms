import { Box, Button, Flex, Heading, Link } from '@chakra-ui/react'
import React from 'react'
import ColorModeToggle from './ColorModeToggle'
import { isLoggedIn, removeAuthToken } from '@/lib/api'


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


                    {typeof window !== 'undefined' && isLoggedIn() ? (
                        <Button
                            colorScheme='red'
                            variant='ghost'
                            onClick={() => {
                                removeAuthToken()
                                window.location.reload()
                            }}
                        >
                            Logout
                        </Button>
                    ) : (
                        <Link>Login/Register</Link>
                    )}

                    <ColorModeToggle />
                </Flex>
            </Flex>
        </Box>
    )
}

export default Header