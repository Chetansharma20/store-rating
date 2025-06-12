import { Box, Button, TextField, Typography, Paper } from '@mui/material'
import axios from 'axios'
import React from 'react'
import { useNavigate } from 'react-router-dom'
import { login } from '../reduxwork/UserSlice'
import { useDispatch } from 'react-redux'

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const doLoginReq = async (event) => {
    event.preventDefault();
    const formEntries = new FormData(event.target);
    const loginUserData = {
      email: formEntries.get('email'),
      password: formEntries.get('password'),
    };

    try {
      const loginResult = await axios.post("http://localhost:3000/api/login", loginUserData);
      const { token, user } = loginResult.data;

     
      const allowedRoles = ["user"]; 
      if (!allowedRoles.includes(user.role)) {
        alert("Unauthorized access");
        return;
      }

    
      localStorage.setItem("token", token);
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      dispatch(login(user));

      navigate('/stores'); 
    } catch (error) {
      alert(error.response?.data?.error || "Login failed");
    }
  };

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        backgroundColor: '#FFEBEE',
        padding: 2,
      }}
    >
      <Paper
        elevation={6}
        sx={{
          padding: 3,
          width: '100%',
          maxWidth: 400,
          borderRadius: 3,
          backgroundColor: '#fff',
        }}
      >
        <Typography variant="h5" align="center" gutterBottom>
          Login
        </Typography>

        <Box
          component="form"
          onSubmit={doLoginReq}
          sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: 2,
          }}
        >
          <TextField
            type="email"
            label="Enter Email"
            variant="outlined"
            name="email"
            required
            sx={{ marginBottom: 2 }}
          />

          <TextField
            type="password"
            label="Enter Password"
            variant="outlined"
            name="password"
            required
            sx={{ marginBottom: 2 }}
          />

          <Button
            type="submit"
            variant="contained"
            color="success"
            fullWidth
            sx={{
              fontWeight: 'bold',
              textTransform: 'none',
              padding: '12px',
              '&:hover': {
                backgroundColor: '#4caf50',
              },
            }}
          >
            Login
          </Button>

          <Typography variant="body2" align="center" sx={{ marginTop: 2 }}>
            New User?{' '}
            <Button
              variant="text"
              size="small"
              onClick={() => navigate("/register")}
              sx={{ textTransform: 'none' }}
            >
              Register
            </Button>
          </Typography>
        </Box>
      </Paper>
    </Box>
  );
};

export default Login;
