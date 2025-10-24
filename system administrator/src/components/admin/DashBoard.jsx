import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Box, Card, CardContent, Typography, Grid } from '@mui/material';

const DashBoard = () => {
  const [stats, setStats] = useState({
    total_users: 0,
    total_stores: 0,
    total_ratings: 0,
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await axios.get('http://localhost:3000/api/admindashboard');
        setStats(res.data);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      }
    };

    fetchStats();
  }, []);

  return (
    <Box p={3}>
      <Typography variant="h4" gutterBottom>
        Admin Dashboard
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} sm={4}>
          <Card sx={{ backgroundColor: '#ecf0f1' }}>
            <CardContent>
              <Typography variant="h6">Total Users</Typography>
              <Typography variant="h5">{stats.total_users}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Card sx={{ backgroundColor: '#ecf0f1' }}>
            <CardContent>
              <Typography variant="h6">Total Stores</Typography>
              <Typography variant="h5">{stats.total_stores}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Card sx={{ backgroundColor: '#ecf0f1' }}>
            <CardContent>
              <Typography variant="h6">Total Ratings</Typography>
              <Typography variant="h5">{stats.total_ratings}</Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default DashBoard;
