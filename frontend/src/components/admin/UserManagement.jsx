import React, { useEffect, useState, useRef, useMemo } from "react";
import { Box, Typography, Alert, TextField, FormControl, InputLabel, Select, MenuItem } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { getAllUsers } from "../../api";

function UserManagement() {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const [searchQuery, setSearchQuery] = useState("");
  const [filterRole, setFilterRole] = useState("");

  const timerRef = useRef(null);

  // Fetch users from your API using GET with backend filters (debounced)
  useEffect(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }

    setLoading(true);
    timerRef.current = setTimeout(async () => {
      try {
        const res = await getAllUsers({
          search: searchQuery,
          role: filterRole,
        });
        setUsers(res.data);
      } catch (err) {
        setError("Failed to fetch users");
      } finally {
        setLoading(false);
      }
    }, 250);

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [searchQuery, filterRole]);

  // DataGrid columns
  const columns = useMemo(() => [
    { field: "name", headerName: "Name", flex: 1 },
    { field: "email", headerName: "Email", flex: 1 },
    { field: "address", headerName: "Address", flex: 1 },
    { field: "role", headerName: "Role", flex: 1 },
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

  // DataGrid expects an "id" field
  const rows = useMemo(() => users.map((u, i) => ({
    id: u.id || u._id || i,
    ...u,
  })), [users]);

  return (
    <Box
      sx={{
        maxWidth: 900,
        margin: "40px auto",
        padding: 3,
        border: "1px solid #ddd",
        borderRadius: 2,
        background: "#fff",
      }}
    >
      <Typography variant="h4" mb={3} align="center">
        User List
      </Typography>
      {error && <Alert severity="error">{error}</Alert>}

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

      <Box sx={{ height: 400, width: "100%", mt: 3 }}>
        <DataGrid
          rows={rows}
          columns={columns}
          loading={loading}
          pageSize={5}
          rowsPerPageOptions={[5, 10]}
          disableSelectionOnClick
          sx={{ height: 400 }} // Fixed height for scroll
        />
      </Box>
    </Box>
  );
}

export default UserManagement;
