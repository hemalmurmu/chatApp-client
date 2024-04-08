import React from 'react'
import Applayout from '../components/layout/Applayout'
import { Box, Typography } from '@mui/material';
import { greyC } from '../components/constants/color';

const Home = () => {
  return (
    <Box bgcolor={greyC} height={"100%"}>
      <Typography p={"2rem"} variant='h5' textAlign={"center"}>
      Select a friend to chat
    </Typography>
    </Box>
    
  )
}

export default Applayout()(Home);