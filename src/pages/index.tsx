import Header from '@/components/Header'
import Board from '@/components/Board'
import Leaderboard from '@/components/Leaderboard'
import { Box } from '@chakra-ui/react'
import React from 'react'

const index = () => {
  return (
    <>
      <Header />
      <Box display="flex" flexDirection="row" alignItems="center" justifyContent="space-evenly" minHeight="100vh"
      >
        <Board />
        <Leaderboard />
      </Box>

    </>

  )
}

export default index