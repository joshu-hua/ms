import Board from '@/components/Board'
import { Box } from '@chakra-ui/react'
import React from 'react'

const index = () => {
  return (
    <>
      <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" minHeight="100vh"
      >
        <Board />
      </Box>

    </>

  )
}

export default index