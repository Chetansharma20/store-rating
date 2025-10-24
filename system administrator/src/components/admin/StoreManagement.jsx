import React, { useEffect, useState } from "react";
import { Box, Typography, Paper } from "@mui/material";
import axios from "axios";
import { DataGrid } from "@mui/x-data-grid";
import api from "../config/axiosconfig";

const StoreManagement = () => {
  const [stores, setStores] = useState([]);

  const fetchStores = async () => {
    try {
      const result = await api.get("/api/stores-with-ratings");
      const updated = result.data.map((store) => ({
        ...store,
        average_rating: parseFloat(store.average_rating || 0),
      }));

      setStores(updated);
    } catch (error) {
      console.error("Failed to fetch stores:", error);
    }
  };

  useEffect(() => {
    fetchStores();
  }, []);

  const columns = [
    { field: "name", headerName: "Store Name", flex: 1 },
    { field: "email", headerName: "Email", flex: 1 },
    { field: "address", headerName: "Address", flex: 1 },
    { field: "owner_id", headerName: "Owner ID", flex: 1 },
    { field: "average_rating", headerName: "Avg Rating", flex: 0.7 },
  ];

  return (
    <Box p={3}>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={2}
      >
        <Typography variant="h5" fontWeight="bold">
          Stores
        </Typography>
      </Box>

      <Paper elevation={3} sx={{ p: 2 }}>
        <DataGrid
          rows={stores}
          columns={columns}
          getRowId={(row) => row.id || row._id}
          autoHeight
          pageSize={7}
          rowsPerPageOptions={[7]}
          sx={{ borderRadius: 2 }}
        />
      </Paper>
    </Box>
  );
};

export default StoreManagement;
