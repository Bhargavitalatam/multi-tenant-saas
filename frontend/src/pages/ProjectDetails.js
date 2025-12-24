import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Container, Typography, Box, Button, Table, TableBody, TableCell, TableHead, TableRow, Chip } from '@mui/material';
import api from '../api/axios';

const ProjectDetails = () => {
  const { projectId } = useParams();
  const [project, setProject] = useState(null);
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const pRes = await api.get(`/projects/${projectId}`);
        const tRes = await api.get(`/projects/${projectId}/tasks`);
        setProject(pRes.data);
        setTasks(tRes.data);
      } catch (err) { console.error("Error loading project details"); }
    };
    fetchDetails();
  }, [projectId]);

  if (!project) return <Typography>Loading...</Typography>;

  return (
    <Container sx={{ mt: 4 }}>
      <Typography variant="h4">{project.name}</Typography>
      <Typography color="textSecondary" paragraph>{project.description}</Typography>
      
      <Box sx={{ mt: 4, display: 'flex', justifyContent: 'space-between' }}>
        <Typography variant="h5">Tasks</Typography>
        <Button variant="contained" color="primary">+ Add Task</Button>
      </Box>

      <Table sx={{ mt: 2 }}>
        <TableHead>
          <TableRow>
            <TableCell>Title</TableCell>
            <TableCell>Priority</TableCell>
            <TableCell>Status</TableCell>
            <TableCell>Due Date</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {tasks.map(task => (
            <TableRow key={task.id}>
              <TableCell>{task.title}</TableCell>
              <TableCell><Chip label={task.priority} size="small" /></TableCell>
              <TableCell><Chip label={task.status} color="info" variant="outlined" size="small" /></TableCell>
              <TableCell>{task.dueDate || 'No date'}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Container>
  );
};
export default ProjectDetails;