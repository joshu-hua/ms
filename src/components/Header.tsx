import { Box, Button, Flex, Heading, Link } from '@chakra-ui/react'
import React, { useEffect, useState } from 'react'
import ColorModeToggle from './ColorModeToggle'
import { isLoggedIn, removeAuthToken } from '@/lib/api'


const Header = () => {
    const [isClient, setIsClient] = useState(false)
    const [loggedIn, setLoggedIn] = useState(false)

    useEffect(() => {
        setIsClient(true)
        setLoggedIn(isLoggedIn())
    }, [])

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
                    {isClient && loggedIn ? (
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
                    ) : isClient ? (
                        <Link>Login/Register</Link>
                    ) : null}

                    <ColorModeToggle />
                </Flex>
            </Flex>
        </Box>
    )
}

export default Header