import Header from '@/components/Header'
import Navbar from '@/components/navbar'
import { Flex, Box } from '@chakra-ui/react'
import React from 'react'


const Profile = () => {
    const linkas = ["hi", "bye", "asdf", "qwer", "zxcv", "test", "profile", "settings", "logout"];

    return (
        <>
            <Header />
            <Box h="100vh">
                <Flex align="center" justify="center" height="100%">
                    <Box
                        p="6"
                        py={10}
                        borderWidth="1px"
                        bg={"panel-bg"}
                        opacity={0.95}
                    >
                        <Flex
                            direction="column"
                            align="center"
                            justify="center"
                            gap={4}
                        >

                            <Box
                                as="h1"
                                fontSize="2xl"
                                fontWeight="bold"
                                color="text-primary"
                            >
                                User name
                            </Box>
                            <Flex>
                                <Navbar links={linkas} current="hi" />

                            </Flex>
                        </Flex>

                    </Box>
                </Flex>
            </Box>
        </>
    )
}

export default Profile