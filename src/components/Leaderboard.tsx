import { Box, Heading, Tab, TabList, TabPanel, TabPanels, Tabs } from '@chakra-ui/react'
import React from 'react'

const Leaderboard = () => {
    return (
        <Box bg="gray.100" p={4} borderRadius="md" minW={'20%'}>
            <Heading size="lg" mb={4} textAlign="center">
                Leaderboard
            </Heading>
            <Box>
                <Tabs variant="enclosed">
                    <TabList>
                        <Tab>Easy</Tab>
                        <Tab>Medium</Tab>
                        <Tab>Hard</Tab>
                    </TabList>
                    <TabPanels>
                        <TabPanel>
                            Easy Leaderboard Content
                        </TabPanel>
                        <TabPanel>
                            Medium Leaderboard Content
                        </TabPanel>
                        <TabPanel>
                            Hard Leaderboard Content
                        </TabPanel>
                    </TabPanels>
                </Tabs>
            </Box>
        </Box>
    )

}

export default Leaderboard