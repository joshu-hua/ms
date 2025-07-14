import Header from '@/components/Header'
import Navbar from '@/components/navbar'
import { Flex, Box, Text } from '@chakra-ui/react'
import { useRouter } from 'next/router'
import React from 'react'

const ProfileTab = () => {
    const router = useRouter();
    const { tab } = router.query;
    const links = ["Stats", "Settings"];

    // Capitalize the current tab for display
    const currentTab = typeof tab === 'string' ? tab.charAt(0).toUpperCase() + tab.slice(1) : 'Stats';

    const renderTabContent = () => {
        switch (tab) {
            case 'stats':
                return (
                    <Box>
                        <Text fontSize="xl" fontWeight="bold" mb={4}>User Statistics</Text>
                        <Text>minesweeper stats will go here...</Text>
                    </Box>
                );
            case 'settings':
                return (
                    <Box>
                        <Text fontSize="xl" fontWeight="bold" mb={4}>Settings</Text>
                        <Text>User settings will go here...</Text>
                    </Box>
                );
            default:
                return (
                    <Box>
                        <Text>Page not found</Text>
                    </Box>
                );
        }
    };

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
                        minW="600px"
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
                                User Profile
                            </Box>

                            <Flex direction="row" gap={6} align="start" w="100%">
                                {/* Navbar on the left */}
                                <Box>
                                    <Navbar links={links} current={currentTab} />
                                </Box>

                                {/* Content on the right */}
                                <Box flex="1" p={4}>
                                    {renderTabContent()}
                                </Box>
                            </Flex>
                        </Flex>
                    </Box>
                </Flex>
            </Box>
        </>
    )
}

export default ProfileTab
