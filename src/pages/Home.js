import React from 'react';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

const Home = () => (
  <Box sx={{ p: 3 }}>
    <Typography variant="h4" gutterBottom>
      Welcome to Qualgent Coding Challenge!
    </Typography>
    <Typography>
      This is your MERN stack starter home page. Use the sidebar to navigate.
    </Typography>
  </Box>
);

export default Home;
