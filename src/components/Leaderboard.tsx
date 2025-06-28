import { Box, Heading, Tab, TabList, TabPanel, TabPanels, Tabs } from '@chakra-ui/react'
import React from 'react'

const Leaderboard = () => {
    return (
        <Box bg="panel-bg" p={4} borderRadius="md" minW={'20%'}>
            <Heading size="lg" mb={4} textAlign="center" color="text-primary">
                Leaderboard
            </Heading>
            <Box>
                <Tabs variant="enclosed">
                    <TabList>
                        <Tab _selected={{ bg: "surface-bg", color: "text-primary" }}>Easy</Tab>
                        <Tab _selected={{ bg: "surface-bg", color: "text-primary" }}>Medium</Tab>
                        <Tab _selected={{ bg: "surface-bg", color: "text-primary" }}>Hard</Tab>
                    </TabList>
                    <TabPanels>
                        <TabPanel color="text-primary">
                            Easy Leaderboard Content
                        </TabPanel>
                        <TabPanel color="text-primary">
                            Medium Leaderboard Content
                        </TabPanel>
                        <TabPanel color="text-primary">
                            Hard Leaderboard Content
                        </TabPanel>
                    </TabPanels>
                </Tabs>
            </Box>
        </Box>
    )

}

export default Leaderboard