import { getScoresByDifficulty } from '@/lib/api';
import { Box, Flex, Heading, ListItem, OrderedList, Tab, TabList, TabPanel, TabPanels, Tabs, Text } from '@chakra-ui/react'
import React, { useEffect, useState } from 'react'

/* eslint-disable @typescript-eslint/no-explicit-any */

interface LeaderBoardData {
    username: string;
    time: number;
    date: Date;
}

const Leaderboard = () => {
    const [easyData, setEasyData] = useState<LeaderBoardData[]>([]);
    const [mediumData, setMediumData] = useState<LeaderBoardData[]>([]);
    const [hardData, setHardData] = useState<LeaderBoardData[]>([]);

    useEffect(() => {
        const fetchLeaderboard = async () => {
            try {
                const easyResponse = await getScoresByDifficulty('easy');
                const mediumResponse = await getScoresByDifficulty('medium');
                const hardResponse = await getScoresByDifficulty('hard');

                if (easyResponse.success && easyResponse.scores) {
                    const mappedEasyData: LeaderBoardData[] = easyResponse.scores
                        .map((score: any) => ({
                            username: score.user?.username || 'Unknown',
                            time: score.time,
                            date: new Date(score.createdAt)
                        }))
                        .sort((a, b) => a.time - b.time) // Sort by time ascending (fastest first)
                        .slice(0, 50); // Limit to top 50
                    setEasyData(mappedEasyData);
                } else {
                    console.error('Error fetching easy scores:', easyResponse.message);
                }

                if (mediumResponse.success && mediumResponse.scores) {
                    const mappedMediumData: LeaderBoardData[] = mediumResponse.scores
                        .map((score: any) => ({
                            username: score.user?.username || 'Unknown',
                            time: score.time,
                            date: new Date(score.createdAt)
                        }))
                        .sort((a, b) => a.time - b.time)
                        .slice(0, 50);
                    setMediumData(mappedMediumData);
                } else {
                    console.error('Error fetching medium scores:', mediumResponse.message);
                }

                if (hardResponse.success && hardResponse.scores) {
                    const mappedHardData: LeaderBoardData[] = hardResponse.scores
                        .map((score: any) => ({
                            username: score.user?.username || 'Unknown',
                            time: score.time,
                            date: new Date(score.createdAt)
                        }))
                        .sort((a, b) => a.time - b.time)
                        .slice(0, 50);
                    setHardData(mappedHardData);
                } else {
                    console.error('Error fetching hard scores:', hardResponse.message);
                }

            } catch (error) {
                console.error('Error fetching leaderboard data:', error);
            }
        }

        fetchLeaderboard();
    }, [])

    const renderLeaderboard = (data: LeaderBoardData[]) => {
        if (data.length === 0) {
            return <Text color="text-secondary">No scores available.</Text>;
        }

        return (
            <OrderedList spacing={1} styleType="none" ml={0}>
                {data.map((score, index) => (
                    <ListItem key={index} py={1}>
                        <Flex justify="space-between" align="center">
                            <Flex align="center" minW="0" flex="1">
                                <Text
                                    color="text-secondary"
                                    fontSize="sm"
                                    minW="24px"
                                    textAlign="right"
                                    mr={3}
                                >
                                    {index + 1}.
                                </Text>
                                <Text
                                    color="text-primary"
                                    fontSize="sm"
                                    isTruncated
                                    maxW="120px"
                                    title={score.username}
                                >
                                    {score.username}
                                </Text>
                            </Flex>
                            <Text
                                color="text-primary"
                                fontSize="sm"
                                fontWeight="medium"
                                minW="50px"
                                textAlign="right"
                            >
                                {score.time}s
                            </Text>
                        </Flex>
                    </ListItem>
                ))}
            </OrderedList>
        );
    };

    return (
        <Box bg="panel-bg" p={4} borderRadius="md" minW={'20%'} maxH={'60vh'} overflowY="auto">
            <Heading size="lg" mb={4} textAlign="center" color="text-primary">
                Leaderboard
            </Heading>
            <Box>
                <Tabs variant="soft-rounded">
                    <TabList>
                        <Tab _selected={{ bg: "surface-bg", color: "text-primary" }}>Easy</Tab>
                        <Tab _selected={{ bg: "surface-bg", color: "text-primary" }}>Medium</Tab>
                        <Tab _selected={{ bg: "surface-bg", color: "text-primary" }}>Hard</Tab>
                    </TabList>
                    <TabPanels>
                        <TabPanel color="text-primary" pl={0}>
                            {renderLeaderboard(easyData)}
                        </TabPanel>
                        <TabPanel color="text-primary" pl={0}>
                            {renderLeaderboard(mediumData)}
                        </TabPanel>
                        <TabPanel color="text-primary" pl={0}>
                            {renderLeaderboard(hardData)}
                        </TabPanel>
                    </TabPanels>
                </Tabs>
            </Box>
        </Box>
    )

}

export default Leaderboard