import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  TextField,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Paper,
  Snackbar,
  Alert,
} from "@mui/material";
import axios from "axios";
import { DataGrid } from "@mui/x-data-grid";
import api from "../config/axiosconfig";


const AddUser = () => {
  const [openDialog, setOpenDialog] = useState(false);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const token = localStorage.getItem("token");

  const openAddDialog = () => setOpenDialog(true);
  const closeAddDialog = () => setOpenDialog(false);

  const fetchUsers = async () => {
    try {
      const result = await api.get("/api/getallusers");
      setUsers(result.data);
    } catch (error) {
      console.error("Failed to fetch users:", error);
      setSnackbar({
        open: true,
        message: "Failed to fetch users",
        severity: "error",
      });
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const SubmitUserData = async (e) => {
    e.preventDefault();
    let formData = new FormData(e.target);
    let reqData = Object.fromEntries(formData.entries());

    // Trim all string values
    reqData = Object.fromEntries(
      Object.entries(reqData).map(([k, v]) => [k, v.trim()])
    );

    // Validate role selection
    if (!reqData.role) {
      setSnackbar({
        open: true,
        message: "Please select a role",
        severity: "warning",
      });
      return;
    }

    // Check for duplicate email locally
    if (users.some((u) => u.email === reqData.email)) {
      setSnackbar({
        open: true,
        message: "Email already exists",
        severity: "error",
      });
      return;
    }

    try {
      setLoading(true);
      await api.post("/api/createusers", reqData);

      setSnackbar({
        open: true,
        message: "User added successfully!",
        severity: "success",
      });
      closeAddDialog();
      fetchUsers();
      e.target.reset();
    } catch (error) {
      const message = error?.response?.data?.error || "Something went wrong";
      setSnackbar({ open: true, message, severity: "error" });
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    { field: "id", headerName: "ID", flex: 1 },
    { field: "name", headerName: "Name", flex: 1 },
    { field: "email", headerName: "Email", flex: 1 },
    { field: "address", headerName: "Address", flex: 1 },
    { field: "role", headerName: "Role", flex: 1 },
  ];

  return (
    <>
      <Box p={3}>
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          mb={2}
        >
          <Typography variant="h5" fontWeight="bold">
            User Management
          </Typography>
          <Button variant="contained" onClick={openAddDialog}>
            Add User
          </Button>
        </Box>

        <Paper elevation={3} sx={{ p: 2 }}>
          <DataGrid
            rows={users}
            columns={columns}
            getRowId={(row) => row.id || row._id}
            autoHeight
            pageSize={7}
            rowsPerPageOptions={[7]}
            sx={{ borderRadius: 2 }}
          />
        </Paper>
      </Box>

      <Dialog
        open={openDialog}
        onClose={closeAddDialog}
        maxWidth="sm"
        fullWidth
      >
        <Box
          component="form"
          onSubmit={SubmitUserData}
          sx={{ p: 3, display: "flex", flexDirection: "column", gap: 2 }}
        >
          <DialogTitle
            sx={{ fontWeight: "bold", textAlign: "center", fontSize: "1.5rem" }}
          >
            Add New User
          </DialogTitle>

          <DialogContent
            sx={{ display: "flex", flexDirection: "column", gap: 2 }}
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
            <TextField label="Address" name="address" fullWidth />
            <FormControl fullWidth required>
              <InputLabel>Select Role</InputLabel>
              <Select name="role" defaultValue="">
                <MenuItem disabled value="">
                  Select Role
                </MenuItem>
                <MenuItem value="admin">Admin</MenuItem>
                <MenuItem value="user">User</MenuItem>
                <MenuItem value="store_owner">Store Owner</MenuItem>
              </Select>
            </FormControl>
          </DialogContent>

          <DialogActions sx={{ justifyContent: "space-between", mt: 1 }}>
            <Button onClick={closeAddDialog} variant="outlined" color="error">
              Cancel
            </Button>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              disabled={loading}
            >
              {loading ? "Submitting..." : "Submit"}
            </Button>
          </DialogActions>
        </Box>
      </Dialog>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert severity={snackbar.severity} sx={{ width: "100%" }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </>
  );
};

export default AddUser;
