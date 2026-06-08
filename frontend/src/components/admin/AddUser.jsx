import React, { useEffect, useState, useRef, useMemo } from "react";
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
import * as api from "../../api";


const AddUser = () => {
  const [openDialog, setOpenDialog] = useState(false);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [gridLoading, setGridLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const [searchQuery, setSearchQuery] = useState("");
  const [filterRole, setFilterRole] = useState("");

  const token = localStorage.getItem("token");
  const timerRef = useRef(null);

  const openAddDialog = () => setOpenDialog(true);
  const closeAddDialog = () => setOpenDialog(false);

  const fetchUsers = async () => {
    try {
      setGridLoading(true);
      const result = await api.getAllUsers({
        search: searchQuery,
        role: filterRole,
      });
      setUsers(result.data);
    } catch (error) {
      console.error("Failed to fetch users:", error);
      setSnackbar({
        open: true,
        message: "Failed to fetch users",
        severity: "error",
      });
    } finally {
      setGridLoading(false);
    }
  };

  useEffect(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }

    timerRef.current = setTimeout(() => {
      fetchUsers();
    }, 250);

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [searchQuery, filterRole]);

  const SubmitUserData = async (e) => {
    e.preventDefault();
    let formData = new FormData(e.target);
    let reqData = Object.fromEntries(formData.entries());

    // Trim all string values
    reqData = Object.fromEntries(
      Object.entries(reqData).map(([k, v]) => [k, v.trim()])
    );

    const { name, email, password, address } = reqData;

    if (!name || name.length < 20 || name.length > 60) {
      setSnackbar({
        open: true,
        message: "Full Name must be between 20 and 60 characters.",
        severity: "error",
      });
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email)) {
      setSnackbar({
        open: true,
        message: "Please enter a valid email address.",
        severity: "error",
      });
      return;
    }

    if (!password || password.length < 8 || password.length > 16) {
      setSnackbar({
        open: true,
        message: "Password must be between 8 and 16 characters.",
        severity: "error",
      });
      return;
    }

    const hasUppercase = /[A-Z]/.test(password);
    const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    if (!hasUppercase || !hasSpecial) {
      setSnackbar({
        open: true,
        message: "Password must include at least one uppercase letter and one special character.",
        severity: "error",
      });
      return;
    }

    if (address && address.length > 400) {
      setSnackbar({
        open: true,
        message: "Address must be at most 400 characters.",
        severity: "error",
      });
      return;
    }

    // Validate role selection
    if (!reqData.role) {
      setSnackbar({
        open: true,
        message: "Please select a role",
        severity: "warning",
      });
      return;
    }

    try {
      setLoading(true);
      await api.register(reqData);

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

  const columns = useMemo(() => [
    { field: "id", headerName: "ID", flex: 0.5 },
    { field: "name", headerName: "Name", flex: 1 },
    { field: "email", headerName: "Email", flex: 1 },
    { field: "address", headerName: "Address", flex: 1 },
    { field: "role", headerName: "Role", flex: 0.7 },
    {
      field: "rating",
      headerName: "Store Owner Rating",
      flex: 1,
      renderCell: (params) => {
        if (params.row.role === "store_owner") {
          return params.row.rating || "No ratings";
        }
        return "-";
      }
    }
  ], []);

  const filteredUsers = useMemo(() => users, [users]);

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
          {/* Quick Search Filters */}
          <Box display="flex" gap={2} mb={2} flexWrap="wrap">
            <TextField
              label="Search by Name, Email, or Address"
              variant="outlined"
              size="small"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              sx={{ flex: 2, minWidth: "250px" }}
            />
            <FormControl size="small" sx={{ flex: 1, minWidth: "150px" }}>
              <InputLabel>Filter by Role</InputLabel>
              <Select
                value={filterRole}
                label="Filter by Role"
                onChange={(e) => setFilterRole(e.target.value)}
              >
                <MenuItem value="">All Roles</MenuItem>
                <MenuItem value="admin">Admin</MenuItem>
                <MenuItem value="user">User</MenuItem>
                <MenuItem value="store_owner">Store Owner</MenuItem>
              </Select>
            </FormControl>
          </Box>

          <DataGrid
            rows={filteredUsers}
            columns={columns}
            loading={gridLoading}
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
