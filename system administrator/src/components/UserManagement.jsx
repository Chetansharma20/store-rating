import React, { useEffect, useState } from "react";
import { Box, Typography, Alert } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import axios from "axios";

function UserList() {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState("");

  // Fetch users from your API using GET
  useEffect(() => {
    async function fetchUsers() {
      try {
        const res = await axios.get("http://localhost:3000/api/getallusers");
        setUsers(res.data);
      } catch (err) {
        setError("Failed to fetch users");
      }
    }
    fetchUsers();
  }, []);

  // DataGrid columns
  const columns = [
    { field: "name", headerName: "Name", flex: 1 },
    { field: "email", headerName: "Email", flex: 1 },
    { field: "address", headerName: "Address", flex: 1 },
    { field: "role", headerName: "Role", flex: 1 }
  ];

  // DataGrid expects an "id" field
  const rows = users.map((u, i) => ({
    id: u.id || u._id || i,
    ...u
  }));

  return (
    <Box
      sx={{
        maxWidth: 900,
        margin: "40px auto",
        padding: 3,
        border: "1px solid #ddd",
        borderRadius: 2,
        background: "#fff"
      }}
    >
      <Typography variant="h4" mb={3} align="center">
        User List
      </Typography>
      {error && <Alert severity="error">{error}</Alert>}
      <Box sx={{ height: 400, width: "100%", mt: 3 }}>
       <DataGrid
  rows={rows}
  columns={columns}
  pageSize={5}
  rowsPerPageOptions={[5, 10]}
  disableSelectionOnClick
  sx={{ height: 400 }} // Fixed height for scroll
/>

      </Box>
    </Box>
  );
}

export default UserList;
