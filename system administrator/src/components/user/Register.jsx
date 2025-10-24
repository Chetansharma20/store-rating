import React from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Paper,
} from "@mui/material";
import axios from "axios";

const Register = () => {
  const SubmitUserData = async (e) => {
    e.preventDefault();
    let formData = new FormData(e.target);
    let reqData = Object.fromEntries(formData.entries());

    try {
      await axios.post("http://localhost:3000/api/createusers", reqData);
      alert("User registered successfully!");
    
    } catch (error) {
      const message = error?.response?.data?.error || "Something went wrong";
      alert(message);
    }
  };

  return (
    <Box sx={{ p: 4, display: "flex", justifyContent: "center" }}>
      <Paper
        elevation={3}
        sx={{
          maxWidth: 500,
          width: "100%",
          p: 3,
          display: "flex",
          flexDirection: "column",
          gap: 2,
          borderRadius: 2,
        }}
      >
        <Typography variant="h5" fontWeight="bold" align="center">
          User Registration
        </Typography>

        <Box component="form" onSubmit={SubmitUserData} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <TextField label="Full Name" name="name" fullWidth required />
          <TextField label="Email" name="email" type="email" fullWidth required />
          <TextField label="Password" name="password" type="password" fullWidth required />
          <TextField label="Address" name="address" fullWidth required />

          <input type="hidden" name="role" value="user" />

          <Button type="submit" variant="contained" color="primary" fullWidth>
            Register
          </Button>
        </Box>
        <Typography variant="body2" align="center" sx={{ marginTop: 2 }}>
                  Already Registered{' '}
                  <Button
                    variant="text"
                    size="small"
                    onClick={() => navigate("/login")}
                    sx={{ textTransform: 'none' }}
                  >
                    Login
                  </Button>
                </Typography>
      </Paper>
       
    </Box>
  );
};

export default Register;
