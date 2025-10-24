import React, { useState } from "react";
import {
  Box,
  TextField,
  Button,
  Typography,
  Paper,
  Alert,
  Container,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import axios from "axios";
import { login } from "../reduxwork/UnifiedUserSlice";
import api from "../config/axiosconfig";

const UnifiedLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    // basic client-side validation
    if (!email.trim() || !password.trim()) {
      setError("Please enter both email and password.");
      setLoading(false);
      return;
    }

    // try {
    //   // Unified login endpoint
    //   const response = await axios.post("http://localhost:3000/api/login", {
    //     email,
    //     password,
    //   });
      
    try {
      // Unified login endpoint
      const response = await api.post("/api/login", {
        email,
        password,
      });


      const { token, user, role } = response.data;

      if (!token || !role) {
        throw new Error("Invalid response from server.");
      }

      // Store token in localStorage
      localStorage.setItem("token", token);
      localStorage.setItem("role", role);

      // Set axios default header
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

      // Dispatch login action
      dispatch(login({ user, role }));

      // Navigate based on role
      if (role === "admin") {
        navigate("/admin/dashboard");
      } else if (role === "store_owner") {
        navigate("/store/dashboard");
      } else {
        navigate("/user/stores");
      }
    } catch (err) {
      console.error("Login error:", err);

      if (err.response && err.response.data) {
        setError(err.response.data.message || "Invalid credentials.");
      } else if (err.request) {
        setError("Server not responding. Please try again later.");
      } else {
        setError("An unexpected error occurred. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="sm">
      <Box
        sx={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Paper elevation={3} sx={{ p: 4, width: "100%", borderRadius: 2 }}>
          <Typography
            variant="h4"
            fontWeight="bold"
            mb={3}
            textAlign="center"
            color="primary"
          >
            Login
          </Typography>

          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          <form onSubmit={handleLogin}>
            <TextField
              fullWidth
              label="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              margin="normal"
              autoComplete="email"
            />

            <TextField
              fullWidth
              label="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              margin="normal"
              autoComplete="current-password"
            />

            <Button
              type="submit"
              fullWidth
              variant="contained"
              disabled={loading}
              sx={{
                mt: 3,
                mb: 2,
                py: 1.5,
                backgroundColor: "#1a237e",
                fontWeight: 600,
                letterSpacing: 0.5,
                "&:hover": {
                  backgroundColor: "#0d47a1",
                },
              }}
            >
              {loading ? "Logging in..." : "Login"}
            </Button>

            <Box textAlign="center">
              <Typography variant="body2">
                Don't have an account?{" "}
                <Button
                  onClick={() => navigate("/register")}
                  sx={{
                    textTransform: "none",
                    fontWeight: "bold",
                    color: "#1a237e",
                  }}
                >
                  Register here
                </Button>
              </Typography>
            </Box>
          </form>
        </Paper>
      </Box>
    </Container>
  );
};

export default UnifiedLogin;
