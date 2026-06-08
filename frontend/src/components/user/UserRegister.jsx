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

import { useNavigate } from "react-router-dom";
import { register } from "../../api";

const UserRegister = () => {
  let navigate = useNavigate();
  const SubmitUserData = async (e) => {
    e.preventDefault();
    let formData = new FormData(e.target);
    let reqData = Object.fromEntries(formData.entries());

    const { name, email, password, address } = reqData;

    if (!name || name.trim().length < 20 || name.trim().length > 60) {
      alert("Full Name must be between 20 and 60 characters.");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email)) {
      alert("Please enter a valid email address.");
      return;
    }

    if (!password || password.length < 8 || password.length > 16) {
      alert("Password must be between 8 and 16 characters.");
      return;
    }

    const hasUppercase = /[A-Z]/.test(password);
    const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    if (!hasUppercase || !hasSpecial) {
      alert("Password must include at least one uppercase letter and one special character.");
      return;
    }

    if (!address || address.trim().length > 400) {
      alert("Address must be at most 400 characters.");
      return;
    }

    try {
      await register(reqData);
      alert("User registered successfully!");
      navigate("/login");
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

        <Box
          component="form"
          onSubmit={SubmitUserData}
          style={{ display: "flex", flexDirection: "column", gap: 16 }}
        >
          <TextField label="Full Name" name="name" fullWidth required />
          <TextField
            label="Email"
            name="email"
            type="email"
            fullWidth
            required
          />
          <TextField
            label="Password"
            name="password"
            type="password"
            fullWidth
            required
          />
          <TextField label="Address" name="address" fullWidth required />

          <input type="hidden" name="role" value="user" />

          <Button type="submit" variant="contained" color="primary" fullWidth>
            Register
          </Button>
        </Box>
        <Typography variant="body2" align="center" sx={{ marginTop: 2 }}>
          Already Registered{" "}
          <Button
            variant="text"
            size="small"
            onClick={() => navigate("/login")}
            sx={{ textTransform: "none" }}
          >
            Login
          </Button>
        </Typography>
      </Paper>
    </Box>
  );
};

export default UserRegister;
