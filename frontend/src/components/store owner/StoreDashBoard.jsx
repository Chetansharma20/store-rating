import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  List,
  ListItem,
  ListItemText,
  DialogActions,
  Button,
  TextField,
  Snackbar,
  Alert,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import * as api from "../../api";

const StoreDashBoard = () => {
  const [stores, setStores] = useState([]);
  const user = JSON.parse(localStorage.getItem("user") || "null");
  
  // Dialog state for viewing ratings
  const [openDialog, setopenDialog] = useState(false);
  const [selectedRatings, setSelectedRatings] = useState([]);

  // Dialog state for adding a store
  const [openStoreDialog, setOpenStoreDialog] = useState(false);
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const openAddDialog = (ratings) => {
    setSelectedRatings(ratings);
    setopenDialog(true);
  };

  const closeAddDialog = () => {
    setopenDialog(false);
  };

  const openAddStoreDialog = () => setOpenStoreDialog(true);
  const closeAddStoreDialog = () => setOpenStoreDialog(false);

  const fetchStores = async () => {
    try {
      const response = await api.getRatingsForStore();
      setStores(response.data);
    } catch (error) {
      console.error("Failed to fetch stores:", error);
    }
  };

  const userId = user?.id;
  useEffect(() => {
    if (userId) {
      fetchStores();
    }
  }, [userId]);

  const SubmitStoreData = async (e) => {
    e.preventDefault();
    let formData = new FormData(e.target);
    let reqData = Object.fromEntries(formData.entries());

    // Trim string inputs
    reqData = Object.fromEntries(
      Object.entries(reqData).map(([k, v]) => [k, typeof v === "string" ? v.trim() : v])
    );

    // Automatically set the logged-in owner's ID
    reqData.owner_id = user?.id;

    if (!reqData.owner_id) {
      setSnackbar({
        open: true,
        message: "Session expired. Please log in again.",
        severity: "error",
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
      closeAddStoreDialog();
      fetchStores();
      e.target.reset();
    } catch (error) {
      const message = error?.response?.data?.error || "Failed to create store";
      setSnackbar({ open: true, message, severity: "error" });
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    { field: "store", headerName: "Store Name", flex: 1 },
    { field: "email", headerName: "Store Email", flex: 1 },
    { field: "address", headerName: "Store Address", flex: 1 },
    { field: "average_rating", headerName: "Avg Rating", flex: 0.5 },
    {
      field: "view_ratings",
      headerName: "View Ratings",
      flex: 1,
      renderCell: (params) => (
        <Button
          variant="outlined"
          size="small"
          onClick={() => openAddDialog(params.row.ratings)}
        >
          View Ratings
        </Button>
      ),
    },
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
            My Stores
          </Typography>
          <Button variant="contained" onClick={openAddStoreDialog}>
            Add Store
          </Button>
        </Box>

        <Paper elevation={3} sx={{ p: 2 }}>
          <DataGrid
            rows={stores}
            columns={columns}
            getRowId={(row) => row.store_id}
            autoHeight
            pageSize={7}
            rowsPerPageOptions={[7]}
            sx={{ borderRadius: 2 }}
          />
        </Paper>
      </Box>

      {/* View Ratings Dialog */}
      <Dialog open={openDialog} onClose={closeAddDialog}>
        <DialogTitle>User Ratings</DialogTitle>
        <DialogContent>
          <List>
            {selectedRatings.map((rating, index) => (
              <ListItem key={index}>
                <ListItemText />
                <Box display="flex" flexDirection="column">
                  <Typography>Name: {rating.user?.name}</Typography>
                  <Typography>Rating: {rating.value}</Typography>
                </Box>
              </ListItem>
            ))}
          </List>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeAddDialog}>Close</Button>
        </DialogActions>
      </Dialog>

      {/* Add Store Dialog */}
      <Dialog
        open={openStoreDialog}
        onClose={closeAddStoreDialog}
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
          </DialogContent>

          <DialogActions sx={{ justifyContent: "space-between", mt: 1 }}>
            <Button onClick={closeAddStoreDialog} variant="outlined" color="error">
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

export default StoreDashBoard;
