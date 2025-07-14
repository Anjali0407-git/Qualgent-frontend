import React, { useState } from 'react';
import { TextField, Button, Box, Typography, Paper } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Login = () => {
  const [form, setForm] = useState({ username: '', password: '' });
  const [err, setErr] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErr('');
    try {
      const res = await axios.post(`${process.env.REACT_APP_API_URL}/api/auth/login`, form);
      localStorage.setItem('token', res.data.token);
      navigate('/');
      window.location.reload();
    } catch (error) {
      setErr(error.response?.data?.msg || 'Login failed');
    }
  };

   const handleSwitchToSignup = () => navigate('/signup');

  return (
    <Box sx={{ p: 0, display: 'flex', height: 'calc(100vh - 64px)', justifyContent: 'center', alignItems: 'center', flex: 1 }}>
      <Paper sx={{ p: 3, maxWidth: 400, mx: 'auto' }}>
        <Typography variant="h5" gutterBottom>Login</Typography>
        <form onSubmit={handleSubmit}>
          <TextField
            label="Username"
            name="username"
            fullWidth
            margin="normal"
            value={form.username}
            onChange={handleChange}
            required
          />
          <TextField
            label="Password"
            name="password"
            type="password"
            fullWidth
            margin="normal"
            value={form.password}
            onChange={handleChange}
            required
          />
          {err && <Typography color="error">{err}</Typography>}
          <Button variant="contained" color="primary" type="submit" fullWidth sx={{ mt: 2 }}>
            Login
          </Button>
        </form>
        <Button
          onClick={handleSwitchToSignup}
          color="secondary"
          fullWidth
          sx={{ mt: 2 }}
        >
          Don't have an account? Sign UP
        </Button>
      </Paper>
    </Box>
  );
};

export default Login;
