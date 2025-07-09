import { getScoresByDifficulty } from '@/lib/api';
import { Box, Heading, ListItem, OrderedList, Tab, TabList, TabPanel, TabPanels, Tabs } from '@chakra-ui/react'
import { Score } from '@/types';
import React, { useEffect, useState } from 'react'

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
                    const mappedEasyData: LeaderBoardData[] = easyResponse.scores.map((score: any) => ({
                        username: score.user?.username || 'Unknown',
                        time: score.time,
                        date: new Date(score.createdAt)
                    }));
                    setEasyData(mappedEasyData);
                } else {
                    console.error('Error fetching easy scores:', easyResponse.message);
                }

                if (mediumResponse.success && mediumResponse.scores) {
                    const mappedMediumData: LeaderBoardData[] = mediumResponse.scores.map((score: any) => ({
                        username: score.user?.username || 'Unknown',
                        time: score.time,
                        date: new Date(score.createdAt)
                    }));
                    setMediumData(mappedMediumData);
                } else {
                    console.error('Error fetching medium scores:', mediumResponse.message);
                }

                if (hardResponse.success && hardResponse.scores) {
                    const mappedHardData: LeaderBoardData[] = hardResponse.scores.map((score: any) => ({
                        username: score.user?.username || 'Unknown',
                        time: score.time,
                        date: new Date(score.createdAt)
                    }));
                    setHardData(mappedHardData);
                } else {
                    console.error('Error fetching hard scores:', hardResponse.message);
                }

            } catch (error) {
                console.error('Error fetching leaderboard data:', error);
            }
        }

        fetchLeaderboard();
    },)

    return (
        <Box bg="panel-bg" p={4} borderRadius="md" minW={'20%'}>
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
                        <TabPanel color="text-primary">
                            {easyData.length > 0 ? (
                                <OrderedList>
                                    {easyData.map((score, index) => (
                                        <ListItem key={index}>
                                            {score.username} - {score.time}s - {score.date.toLocaleDateString()}
                                        </ListItem>
                                    ))}
                                </OrderedList>
                            ) : (
                                <p>No scores available for Easy difficulty.</p>
                            )}
                        </TabPanel>
                        <TabPanel color="text-primary">
                            {mediumData.length > 0 ? (
                                <OrderedList>
                                    {mediumData.map((score, index) => (
                                        <ListItem key={index}>
                                            {score.username} - {score.time}s - {score.date.toLocaleDateString()}
                                        </ListItem>
                                    ))}
                                </OrderedList>
                            ) : (
                                <p>No scores available for Medium difficulty.</p>
                            )}
                        </TabPanel>
                        <TabPanel color="text-primary">
                            {hardData.length > 0 ? (
                                <OrderedList>
                                    {hardData.map((score, index) => (
                                        <ListItem key={index}>
                                            {score.username} - {score.time}s - {score.date.toLocaleDateString()}
                                        </ListItem>
                                    ))}
                                </OrderedList>
                            ) : (
                                <p>No scores available for Hard difficulty.</p>
                            )}
                        </TabPanel>
                    </TabPanels>
                </Tabs>
            </Box>
        </Box>
    )

}

export default Leaderboard