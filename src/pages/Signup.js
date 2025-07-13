import React, { useState } from 'react';
import { TextField, Button, Box, Typography, Paper } from '@mui/material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Signup = () => {
  const [form, setForm] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const res = await axios.post(
        `${process.env.REACT_APP_API_URL}/api/auth/signup`,
        form
        );
        console.log('Signup response:', res);
      
        if (res.status === 200) {
        //   localStorage.setItem('token', res.data.token);
        navigate('/login');
        } else {
        setError(res.data.msg || 'Signup succeeded, but unexpected status.');
        }
    } catch (err) {
      setError(
        err.response?.data?.msg ||
        'Signup failed. Please try a different username.'
      );
    }
  };

  const handleSwitchToLogin = () => navigate('/login');

  return (
    <Box sx={{ p: 3 }}>
      <Paper sx={{ p: 3, maxWidth: 400, mx: 'auto' }}>
        <Typography variant="h5" gutterBottom>
          Sign Up
        </Typography>
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
          {error && (
            <Typography color="error" sx={{ mt: 1 }}>
              {error}
            </Typography>
          )}
          <Button
            variant="contained"
            color="primary"
            type="submit"
            fullWidth
            sx={{ mt: 2 }}
          >
            Sign Up
          </Button>
        </form>
        <Button
          onClick={handleSwitchToLogin}
          color="secondary"
          fullWidth
          sx={{ mt: 2 }}
        >
          Already have an account? Login
        </Button>
      </Paper>
    </Box>
  );
};

export default Signup;
