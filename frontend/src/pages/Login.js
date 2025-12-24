import React, { useState, useContext } from 'react';
import { Container, TextField, Button, Typography, Box, Alert } from '@mui/material';
import api from '../api/axios';
import { AuthContext } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '', subdomain: '' });
  const [error, setError] = useState('');
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post('/auth/login', formData);
      login(res.data.token);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    }
  };

  return (
    <Container maxWidth="xs">
      <Box sx={{ mt: 8, p: 3, boxShadow: 3, borderRadius: 2 }}>
        <Typography variant="h4" align="center">Login</Typography>
        {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}
        <form onSubmit={handleSubmit}>
          <TextField fullWidth margin="normal" label="Tenant Subdomain" onChange={(e) => setFormData({...formData, subdomain: e.target.value})} required />
          <TextField fullWidth margin="normal" label="Email" type="email" onChange={(e) => setFormData({...formData, email: e.target.value})} required />
          <TextField fullWidth margin="normal" label="Password" type="password" onChange={(e) => setFormData({...formData, password: e.target.value})} required />
          <Button fullWidth variant="contained" type="submit" sx={{ mt: 3 }}>Login</Button>
        </form>
        <Typography sx={{ mt: 2, textAlign: 'center' }}>
          Don't have a tenant? <Link to="/register">Register here</Link>
        </Typography>
      </Box>
    </Container>
  );
};
export default Login;