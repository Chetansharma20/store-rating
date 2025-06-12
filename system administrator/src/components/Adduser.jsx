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
} from "@mui/material";
import axios from "axios";
import { DataGrid } from "@mui/x-data-grid";

const AddUser = () => {
  const [openDialog, setOpenDialog] = useState(false);
  const [users, setUsers] = useState([]);

  const openAddDialog = () => setOpenDialog(true);
  const closeAddDialog = () => setOpenDialog(false);

  const fetchUsers = async () => {
    try {
      const result = await axios.get("http://localhost:3000/api/getallusers");
      setUsers(result.data);
    } catch (error) {
      console.error("Failed to fetch users:", error);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const SubmitUserData = async (e) => {
    e.preventDefault();
    let formData = new FormData(e.target);
    let reqData = Object.fromEntries(formData.entries());
    try {
      await axios.post("http://localhost:3000/api/createusers", reqData);
      alert("User added successfully!");
      closeAddDialog();
      fetchUsers();
      e.target.reset();
    } catch (error) {
      const message = error?.response?.data?.error || "Something went wrong";
      alert(message);
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

      <Dialog open={openDialog} onClose={closeAddDialog} maxWidth="sm" fullWidth>
        <Box
          component="form"
          onSubmit={SubmitUserData}
          sx={{
            p: 3,
            display: "flex",
            flexDirection: "column",
            gap: 2,
          }}
        >
          <DialogTitle
            sx={{ fontWeight: "bold", textAlign: "center", fontSize: "1.5rem" }}
          >
            Add New User
          </DialogTitle>

          <DialogContent sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <TextField label="Full Name" name="name" fullWidth required />
            <TextField label="Email" name="email" type="email" fullWidth required />
            <TextField label="Password" name="password" type="password" fullWidth required />
            <TextField label="Address" name="address" fullWidth required />
            <FormControl fullWidth required>
              <InputLabel>Select Role</InputLabel>
              <Select name="role" defaultValue="">
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
            <Button type="submit" variant="contained" color="primary">
              Submit
            </Button>
          </DialogActions>
        </Box>
      </Dialog>
    </>
  );
};

export default AddUser;
