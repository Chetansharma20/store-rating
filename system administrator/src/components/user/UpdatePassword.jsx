import React, { useState } from 'react';
import { Box, Button, TextField, Typography, Paper, Snackbar } from '@mui/material';
import axios from 'axios';
import { useSelector } from 'react-redux';

const UpdatePassword = () => {
  const{userData} = useSelector((state)=>state.user)
  console.log(userData)
 
  const [snackbarOpen, setSnackbarOpen] = useState(false);
 
  const handleSubmit = async (e) => {
    e.preventDefault();
 let formData = new FormData(e.target);
    let reqData = Object.fromEntries(formData.entries());

  console.log(userData.user.id)


    try {
     
      const res = await axios.post('http://localhost:3000/api/updatepassword',{...reqData, userId:userData.user.id})
      setSnackbarOpen(true);
  
    } catch (error) {
    console.log(error)
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        backgroundColor: '#FFEBEE',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 1,
      }}
    >
      <Paper
        elevation={3}
        sx={{
          padding: 3,
          width: '100%',
          maxWidth: 400,
          borderRadius: 2,
        }}
      >
        <Typography variant="h5" align="center" gutterBottom>
          Update Password
        </Typography>
        <Box
          component="form"
          onSubmit={handleSubmit}
          sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: 2,
          }}
        >
         <TextField
            label="Old Password"
            type="password"
            
            name="oldPassword"
            onChange={(e) => setNewPassword(e.target.value)}
            required
        
          />
          <TextField
            label="New Password"
            type="password"
        
            name="newPassword"
            onChange={(e) => setNewPassword(e.target.value)}
            required
           
          />
          <Button type="submit" variant="contained" color="success">
            Update Password
          </Button>
         
        </Box>
      </Paper>
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={() => setSnackbarOpen(false)}
        message="Password updated successfully"
      />
    </Box>
  );
};

export default UpdatePassword;
