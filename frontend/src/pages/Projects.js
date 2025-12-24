import React, { useEffect, useState } from 'react';
import { Container, Typography, Button, Card, CardContent, Grid, Chip, Box, Dialog, TextField } from '@mui/material';
import api from '../api/axios';

const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [open, setOpen] = useState(false);
  const [newProject, setNewProject] = useState({ name: '', description: '' });

  const fetchProjects = async () => {
    try {
      const res = await api.get('/projects');
      setProjects(res.data);
    } catch (err) { console.error("Error fetching projects"); }
  };

  useEffect(() => { fetchProjects(); }, []);

  const handleCreate = async () => {
    try {
      await api.post('/projects', newProject);
      setOpen(false);
      fetchProjects();
    } catch (err) { alert("Failed to create project"); }
  };

  return (
    <Container sx={{ mt: 4 }}>
      <Box display="flex" justifyContent="space-between" mb={3}>
        <Typography variant="h4">Projects</Typography>
        <button className="btn-primary" onClick={() => setOpen(true)} style={{padding: '10px 20px', cursor: 'pointer'}}>+ Create Project</button>
      </Box>

      <Grid container spacing={3}>
        {projects.map((project) => (
          <Grid item xs={12} md={4} key={project.id}>
            <Card sx={{ height: '100%', boxShadow: 2 }}>
              <CardContent>
                <Typography variant="h6">{project.name}</Typography>
                <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
                  {project.description}
                </Typography>
                <Chip label={project.status || 'Active'} color="primary" variant="outlined" />
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Dialog open={open} onClose={() => setOpen(false)}>
        <Box sx={{ p: 3, width: 400 }}>
          <Typography variant="h6">New Project</Typography>
          <TextField fullWidth margin="normal" label="Project Name" onChange={(e) => setNewProject({...newProject, name: e.target.value})} />
          <TextField fullWidth margin="normal" label="Description" multiline rows={3} onChange={(e) => setNewProject({...newProject, description: e.target.value})} />
          <Button fullWidth variant="contained" sx={{ mt: 2 }} onClick={handleCreate}>Save Project</Button>
        </Box>
      </Dialog>
    </Container>
  );
};
export default Projects;