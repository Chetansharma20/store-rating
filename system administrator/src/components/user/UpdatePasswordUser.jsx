import React, { useState } from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  Paper,
  Snackbar,
} from "@mui/material";
import axios from "axios";
import { useSelector } from "react-redux";
import api from "../config/axiosconfig";

const UpdatePasswordUser = () => {
  const { user } = useSelector((state) => state.user);
  console.log(user);

  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [newPassword, setNewPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    let formData = new FormData(e.target);
    let reqData = Object.fromEntries(formData.entries());
    const token = localStorage.getItem("token");
    // console.log(user.user.id)

    try {
      const res = await api.post("/api/updatepassword", {
        ...reqData,
        userId: user.id,
      });
      setSnackbarOpen(true);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        backgroundColor: "#FFEBEE",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 1,
      }}
    >
      <Paper
        elevation={3}
        sx={{
          padding: 3,
          width: "100%",
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
            display: "flex",
            flexDirection: "column",
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

export default UpdatePasswordUser;
