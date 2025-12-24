import React, { useEffect, useState } from 'react';
import { Container, Typography, Table, TableBody, TableCell, TableHead, TableRow, Paper, Chip } from '@mui/material';
import api from '../api/axios';

const Users = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await api.get('/users'); // Backend will filter by tenantId
        setUsers(res.data);
      } catch (err) { console.error("Error fetching users"); }
    };
    fetchUsers();
  }, []);

  return (
    <Container sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>Team Members</Typography>
      <Paper sx={{ width: '100%', overflow: 'hidden', boxShadow: 3 }}>
        <Table>
          <TableHead sx={{ bgcolor: '#eee' }}>
            <TableRow>
              <TableCell><strong>Name</strong></TableCell>
              <TableCell><strong>Email</strong></TableCell>
              <TableCell><strong>Role</strong></TableCell>
              <TableCell><strong>Status</strong></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.id}>
                <TableCell>{user.name}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell><Chip label={user.role} size="small" /></TableCell>
                <TableCell><Chip label="Active" color="success" variant="outlined" size="small" /></TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>
    </Container>
  );
};
export default Users;