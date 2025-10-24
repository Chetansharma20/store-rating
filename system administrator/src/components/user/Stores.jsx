import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Paper,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import Rating from "@mui/material/Rating";
import Stack from "@mui/material/Stack";
import { useSelector } from "react-redux";
import api from "../config/axiosconfig";

const Stores = () => {
  const { user } = useSelector((state) => state.user);
  const [stores, setStores] = useState([]);
  const [selectedStore, setSelectedStore] = useState(null);
  const [ratingValue, setRatingValue] = useState(0);
  const [openDialog, setOpenDialog] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const openAddDialog = (store) => {
    setRatingValue(store.average_rating || 0);
    setSelectedStore(store);
    setOpenDialog(true);
  };

  const closeAddDialog = () => {
    setOpenDialog(false);
  };

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

  const submitRating = async (e) => {
    e.preventDefault();
    if (!selectedStore) return;

    const payload = {
      user_id: user.id,
      store_id: selectedStore.id,
      value: ratingValue,
    };

    try {
      const response = await api.post("/api/createratings", payload);
      console.log("Rating submitted:", response.data);

      // Update the stores state directly without fetching again
      setStores((prevStores) =>
        prevStores.map((store) =>
          store.id === selectedStore.id
            ? {
                ...store,
                average_rating: response.data.updatedAverageRating, // assuming API returns this
                ratings: response.data.ratings || store.ratings,
              }
            : store
        )
      );

      closeAddDialog();
    } catch (error) {
      console.error("Error submitting rating:", error);
    }
  };

  useEffect(() => {
    fetchStores();
  }, []);

  const columns = [
    { field: "name", headerName: "Store Name", flex: 1 },
    { field: "address", headerName: "Address", flex: 1 },
    { field: "average_rating", headerName: "Ratings", flex: 1 },
    {
      field: "value",
      headerName: "Rate",
      width: 100,
      renderCell: (params) => {
        const store = params.row;
        const userHasRated = store.ratings?.some(
          (rating) => rating.user_id === user.id
        );

        return (
          <Button
            variant="contained"
            size="small"
            color="info"
            sx={{ borderRadius: "20px", textTransform: "none" }}
            onClick={() => openAddDialog(store)}
          >
            {userHasRated ? "Update" : "Add"}
          </Button>
        );
      },
    },
  ];

  const rows = stores
    .filter(
      (str) =>
        str.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        str.address?.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .map((str, index) => ({
      id: str._id || index,
      ...str,
    }));

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
          <TextField
            label="Search Stores"
            variant="outlined"
            size="small"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </Box>

        <Paper elevation={3} sx={{ p: 2 }}>
          <DataGrid
            rows={rows}
            columns={columns}
            getRowId={(row) => row.id}
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
          onSubmit={submitRating}
          sx={{
            p: 3,
            display: "flex",
            flexDirection: "column",
            gap: 2,
            width: "500px",
          }}
        >
          <DialogTitle sx={{ fontWeight: "bold", textAlign: "center" }}>
            Add Ratings
          </DialogTitle>
          <DialogContent
            sx={{ display: "flex", flexDirection: "column", gap: 1 }}
          >
            <Stack spacing={1}>
              <Rating
                name="value"
                value={ratingValue}
                precision={1}
                onChange={(event, newValue) => setRatingValue(newValue)}
              />
            </Stack>
          </DialogContent>
          <DialogActions>
            <Button type="submit" variant="contained" color="primary">
              Submit
            </Button>
            <Button onClick={closeAddDialog} variant="contained" color="error">
              Close
            </Button>
          </DialogActions>
        </Box>
      </Dialog>
    </>
  );
};

export default Stores;
