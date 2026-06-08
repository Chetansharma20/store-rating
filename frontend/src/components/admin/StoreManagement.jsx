import React, { useEffect, useState, useRef, useMemo } from "react";
import {
  Box,
  Typography,
  Paper,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Snackbar,
  Alert,
} from "@mui/material";
import axios from "axios";
import { DataGrid } from "@mui/x-data-grid";
import * as api from "../../api";

const StoreManagement = () => {
  const [stores, setStores] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [owners, setOwners] = useState([]);
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const [searchQuery, setSearchQuery] = useState("");

  const timerRef = useRef(null);

  const openAddDialog = () => setOpenDialog(true);
  const closeAddDialog = () => setOpenDialog(false);

  const fetchStores = async () => {
    try {
      const result = await api.getStoresWithRatings({
        search: searchQuery,
      });
      const updated = result.data.map((store) => ({
        ...store,
        average_rating: parseFloat(store.average_rating || 0),
      }));

      setStores(updated);
    } catch (error) {
      console.error("Failed to fetch stores:", error);
    }
  };

  const fetchOwners = async () => {
    try {
      const res = await api.getAllUsers();
      const storeOwners = res.data.filter((user) => user.role === "store_owner");
      setOwners(storeOwners);
    } catch (error) {
      console.error("Failed to fetch store owners:", error);
    }
  };

  useEffect(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }

    timerRef.current = setTimeout(() => {
      fetchStores();
    }, 500);

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [searchQuery]);

  useEffect(() => {
    fetchOwners();
  }, []);

  const SubmitStoreData = async (e) => {
    e.preventDefault();
    let formData = new FormData(e.target);
    let reqData = Object.fromEntries(formData.entries());

    // Trim string inputs
    reqData = Object.fromEntries(
      Object.entries(reqData).map(([k, v]) => [k, typeof v === "string" ? v.trim() : v])
    );

    if (!reqData.owner_id) {
      setSnackbar({
        open: true,
        message: "Please select a store owner",
        severity: "warning",
      });
      return;
    }

    try {
      setLoading(true);
      await api.createStore(reqData);
      setSnackbar({
        open: true,
        message: "Store created successfully!",
        severity: "success",
      });
      closeAddDialog();
      fetchStores();
      e.target.reset();
    } catch (error) {
      const message = error?.response?.data?.error || "Failed to create store";
      setSnackbar({ open: true, message, severity: "error" });
    } finally {
      setLoading(false);
    }
  };

  const columns = useMemo(() => [
    { field: "name", headerName: "Store Name", flex: 1 },
    { field: "email", headerName: "Email", flex: 1 },
    { field: "address", headerName: "Address", flex: 1 },
    { field: "owner_id", headerName: "Owner ID", flex: 1 },
    { field: "average_rating", headerName: "Avg Rating", flex: 0.7 },
  ], []);

  const filteredStores = useMemo(() => stores, [stores]);

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
            Stores
          </Typography>
          <Button variant="contained" onClick={openAddDialog}>
            Add Store
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
              sx={{ flex: 1, minWidth: "250px" }}
            />
          </Box>

          <DataGrid
            rows={filteredStores}
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
          onSubmit={SubmitStoreData}
          sx={{ p: 3, display: "flex", flexDirection: "column", gap: 2 }}
        >
          <DialogTitle
            sx={{ fontWeight: "bold", textAlign: "center", fontSize: "1.5rem" }}
          >
            Add New Store
          </DialogTitle>

          <DialogContent
            sx={{ display: "flex", flexDirection: "column", gap: 2 }}
          >
            <TextField label="Store Name" name="name" fullWidth required />
            <TextField
              label="Store Email"
              name="email"
              type="email"
              fullWidth
              required
            />
            <TextField label="Store Address" name="address" fullWidth required />
            <FormControl fullWidth required>
              <InputLabel>Select Store Owner</InputLabel>
              <Select name="owner_id" defaultValue="">
                <MenuItem disabled value="">
                  Select Owner
                </MenuItem>
                {owners.map((owner) => (
                  <MenuItem key={owner.id} value={owner.id}>
                    {owner.name} ({owner.email})
                  </MenuItem>
                ))}
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

export default StoreManagement;
