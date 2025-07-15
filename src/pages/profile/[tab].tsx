import Header from '@/components/Header'
import Navbar from '@/components/navbar'
import { Flex, Box, Text, Spinner, Alert, AlertIcon, Table, Thead, Tbody, Tr, Th, Td, TableContainer, Badge } from '@chakra-ui/react'
import { useRouter } from 'next/router'
import React, { useState, useEffect } from 'react'
import { getCurrentUsername, getCurrentUserId, getUserStats } from '@/lib/api'
import { UserStats } from '@/types'

const ProfileTab = () => {
    const router = useRouter();
    const { tab } = router.query;
    const links = ["Stats", "Settings"];
    const [username, setUsername] = useState<string | null>(null);
    const [loading, setIsLoading] = useState<boolean>(false);
    const [userStats, setUserStats] = useState<UserStats[]>([]);
    const [statsError, setStatsError] = useState<string | null>(null);

    // Capitalize the current tab for display
    const currentTab = typeof tab === 'string' ? tab.charAt(0).toUpperCase() + tab.slice(1) : 'Stats';

    useEffect(() => {
        // Get username from JWT token when component mounts
        const currentUsername = getCurrentUsername();
        setUsername(currentUsername);
    }, []);

    useEffect(() => {
        // Load user stats when component mounts or tab changes to stats
        const fetchUserStats = async () => {
            if (tab === 'stats') {
                setIsLoading(true);
                setStatsError(null);

                try {
                    const userId = getCurrentUserId();
                    if (!userId) {
                        setStatsError("User not authenticated");
                        return;
                    }

                    const response = await getUserStats(userId);

                    if (response.success && response.stats) {
                        setUserStats(response.stats);
                    } else {
                        setStatsError(response.message || "Failed to load stats");
                    }
                } catch (error) {
                    console.error("Error fetching stats:", error);
                    setStatsError("An error occurred while loading stats");
                } finally {
                    setIsLoading(false);
                }
            }
        };

        fetchUserStats();
    }, [tab]);

    // Helper function to calculate win rate
    const calculateWinRate = (wins: number, total: number): string => {
        if (total === 0) return "0%";
        return ((wins / total) * 100).toFixed(1) + "%";
    };

    // Helper function to format difficulty display
    const formatDifficulty = (difficulty: string): string => {
        return difficulty.charAt(0).toUpperCase() + difficulty.slice(1);
    };

    // Helper function to get difficulty color
    const getDifficultyColor = (difficulty: string): string => {
        switch (difficulty.toLowerCase()) {
            case 'easy': return 'green';
            case 'medium': return 'orange';
            case 'hard': return 'red';
            default: return 'gray';
        }
    };

    const renderTabContent = () => {
        switch (tab) {
            case 'stats':
                return (
                    <Box>
                        <Text fontSize="xl" fontWeight="bold" mb={4}>User Statistics</Text>

                        {loading && (
                            <Flex justify="center" align="center" p={8}>
                                <Spinner size="lg" />
                                <Text ml={4}>Loading stats...</Text>
                            </Flex>
                        )}

                        {statsError && (
                            <Alert status="error" mb={4}>
                                <AlertIcon />
                                {statsError}
                            </Alert>
                        )}

                        {!loading && !statsError && userStats.length === 0 && (
                            <Alert status="info">
                                <AlertIcon />
                                No statistics available yet. Play some games to see your stats!
                            </Alert>
                        )}

                        {!loading && !statsError && userStats.length > 0 && (
                            <>
                                {/* Summary Stats */}
                                <Flex gap={4} mb={6} wrap="wrap">
                                    <Box
                                        p={4}
                                        bg="gray.50"
                                        borderRadius="md"
                                        minW="150px"
                                        textAlign="center"
                                    >
                                        <Text fontSize="2xl" fontWeight="bold" color="blue.500">
                                            {userStats.reduce((sum, stat) => sum + stat.totalGames, 0)}
                                        </Text>
                                        <Text fontSize="sm" color="gray.600">Total Games</Text>
                                    </Box>
                                    <Box
                                        p={4}
                                        bg="gray.50"
                                        borderRadius="md"
                                        minW="150px"
                                        textAlign="center"
                                    >
                                        <Text fontSize="2xl" fontWeight="bold" color="green.500">
                                            {userStats.reduce((sum, stat) => sum + stat.totalWins, 0)}
                                        </Text>
                                        <Text fontSize="sm" color="gray.600">Total Wins</Text>
                                    </Box>
                                    <Box
                                        p={4}
                                        bg="gray.50"
                                        borderRadius="md"
                                        minW="150px"
                                        textAlign="center"
                                    >
                                        <Text fontSize="2xl" fontWeight="bold" color="purple.500">
                                            {calculateWinRate(
                                                userStats.reduce((sum, stat) => sum + stat.totalWins, 0),
                                                userStats.reduce((sum, stat) => sum + stat.totalGames, 0)
                                            )}
                                        </Text>
                                        <Text fontSize="sm" color="gray.600">Overall Win Rate</Text>
                                    </Box>
                                </Flex>

                                {/* Detailed Stats Table */}
                                <TableContainer>
                                    <Table variant="simple" size="md">
                                        <Thead>
                                            <Tr>
                                                <Th>Difficulty</Th>
                                                <Th isNumeric>Games Played</Th>
                                                <Th isNumeric>Games Won</Th>
                                                <Th isNumeric>Win Rate</Th>
                                                <Th>Last Played</Th>
                                            </Tr>
                                        </Thead>
                                        <Tbody>
                                            {userStats.map((stat) => (
                                                <Tr key={stat.id}>
                                                    <Td>
                                                        <Badge
                                                            colorScheme={getDifficultyColor(stat.difficulty)}
                                                            variant="solid"
                                                        >
                                                            {formatDifficulty(stat.difficulty)}
                                                        </Badge>
                                                    </Td>
                                                    <Td isNumeric fontWeight="medium">{stat.totalGames}</Td>
                                                    <Td isNumeric fontWeight="medium">{stat.totalWins}</Td>
                                                    <Td isNumeric fontWeight="medium">
                                                        {calculateWinRate(stat.totalWins, stat.totalGames)}
                                                    </Td>
                                                    <Td>
                                                        {new Date(stat.lastPlayed).toLocaleDateString()}
                                                    </Td>
                                                </Tr>
                                            ))}
                                        </Tbody>
                                    </Table>
                                </TableContainer>
                            </>
                        )}
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
                                {username ? `${username}'s Profile` : 'User Profile'}
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
