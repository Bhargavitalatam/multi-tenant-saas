import React, { useState } from 'react';
import api from '../utils/api';
import { useNavigate } from 'react-router-dom';

const Register = () => {
  const [formData, setFormData] = useState({
    tenant_name: '', full_name: '', email: '', password: ''
  });
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/auth/register', formData);
      alert('Registration successful! Please login.');
      navigate('/login');
    } catch (err) {
      alert(err.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <div className="auth-container">
      <h2>Create Business Account</h2>
      <form onSubmit={handleSubmit}>
        <input type="text" placeholder="Company/Tenant Name" onChange={e => setFormData({...formData, tenant_name: e.target.value})} required />
        <input type="text" placeholder="Full Name" onChange={e => setFormData({...formData, full_name: e.target.value})} required />
        <input type="email" placeholder="Email" onChange={e => setFormData({...formData, email: e.target.value})} required />
        <input type="password" placeholder="Password (min 6 chars)" onChange={e => setFormData({...formData, password: e.target.value})} required />
        <button type="submit">Register</button>
      </form>
    </div>
  );
};

export default Register;