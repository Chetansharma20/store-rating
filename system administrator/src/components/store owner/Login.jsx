import { Box, Paper, TextField, Typography, Button } from '@mui/material';
import axios from 'axios';
import React from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { login } from './reduxwork/UserSlice';

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleLogin = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const loginData = Object.fromEntries(formData.entries());

    try {
      const response = await axios.post("http://localhost:3000/api/login", loginData);

      const { token, user } = response.data;

    
      const allowedRoles = ['store_owner']; 

      if (!allowedRoles.includes(user.role)) {
        alert(' Unauthorized Access');
        return;
      }

     
      localStorage.setItem('token', token);
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

      dispatch(login(user));

      if (user.role === 'admin') navigate('/admin-dashboard');
      else if (user.role === 'store_owner') navigate('/stores');
      else navigate('/');

    } catch (error) {
      console.error("Login error:", error.response?.data || error.message);
      alert("Login failed. Check email/password.");
    }
  };

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '80vh',
        padding: 2,
        width: '70vw',
        marginRight: '70px',
        flexDirection: 'column',
      }}
    >
      <Paper
        elevation={8}
        sx={{
          padding: 5,
          width: '100%',
          maxWidth: 400,
          borderRadius: 4,
          backgroundColor: '#ffffff',
          boxShadow: '0 8px 24px rgba(0,0,0,0.1)',
        }}
      >
        <Typography
          variant="h5"
          align="center"
          sx={{ fontWeight: 700, marginBottom: 3, color: '#1565c0' }}
        >
          User Login
        </Typography>

        <Box
          component="form"
          onSubmit={handleLogin}
          sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}
        >
          <TextField
            label="Email"
            type="email"
            name="email"
            variant="outlined"
            required
            fullWidth
            sx={{
              '& .MuiOutlinedInput-root': { borderRadius: '12px' },
              '& .MuiInputLabel-root': { fontWeight: 500 },
            }}
          />
          <TextField
            label="Password"
            type="password"
            name="password"
            variant="outlined"
            required
            fullWidth
            sx={{
              '& .MuiOutlinedInput-root': { borderRadius: '12px' },
              '& .MuiInputLabel-root': { fontWeight: 500 },
            }}
          />
          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            sx={{
              fontWeight: 'bold',
              paddingY: 1.2,
              textTransform: 'none',
              fontSize: '1rem',
              borderRadius: '12px',
              '&:hover': {
                backgroundColor: '#0d47a1',
              },
            }}
          >
            Login
          </Button>
        </Box>
      </Paper>
    </Box>
  );
};

export default Login;
