import React, { useEffect, useState } from 'react';
import { Container, Grid, Paper, Typography, Box } from '@mui/material';
import api from '../api/axios';

const Dashboard = () => {
  const [stats, setStats] = useState({ projects: 0, tasks: 0, completed: 0 });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await api.get('/projects/stats'); // We will ensure backend has this in Step 5
        setStats(res.data);
      } catch (err) { console.error("Error fetching stats"); }
    };
    fetchStats();
  }, []);

  return (
    <Container sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>Dashboard</Typography>
      <Grid container spacing={3}>
        {[
          { label: 'Total Projects', value: stats.projects },
          { label: 'Total Tasks', value: stats.tasks },
          { label: 'Completed Tasks', value: stats.completed }
        ].map((item) => (
          <Grid item xs={12} md={4} key={item.label}>
            <Paper sx={{ p: 3, textAlign: 'center', bgcolor: '#f5f5f5' }}>
              <Typography variant="h6">{item.label}</Typography>
              <Typography variant="h3" color="primary">{item.value}</Typography>
            </Paper>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};
export default Dashboard;