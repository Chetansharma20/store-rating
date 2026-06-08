import React, { useEffect, useState, useRef, useMemo } from "react";
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
import * as api from "../../api";

const Stores = () => {
  const user = JSON.parse(localStorage.getItem("user") || "null");
  const [stores, setStores] = useState([]);
  const [selectedStore, setSelectedStore] = useState(null);
  const [ratingValue, setRatingValue] = useState(0);
  const [openDialog, setOpenDialog] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const timerRef = useRef(null);

  const openAddDialog = (store) => {
    const myRating = store.ratings?.find(
      (rating) => rating.user_id === user?.id
    );
    setRatingValue(myRating ? myRating.value : 0);
    setSelectedStore(store);
    setOpenDialog(true);
  };

  const closeAddDialog = () => {
    setOpenDialog(false);
  };

  const fetchStores = async () => {
    try {
      const result = await api.getStoresWithRatings({ search: searchTerm });
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

    if (!user?.id) {
      console.error("User is not logged in");
      return;
    }

    const payload = {
      user_id: user.id,
      store_id: selectedStore.id,
      value: ratingValue,
    };

    try {
      const response = await api.submitRating(payload);
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
  }, [searchTerm]);

  const columns = useMemo(() => [
    { field: "name", headerName: "Store Name", flex: 1 },
    { field: "address", headerName: "Address", flex: 1 },
    { field: "average_rating", headerName: "Overall Rating", flex: 1 },
    {
      field: "my_rating",
      headerName: "My Submitted Rating",
      flex: 1,
      renderCell: (params) => {
        const store = params.row;
        const myRating = store.ratings?.find(
          (rating) => rating.user_id === user?.id
        );
        return myRating ? `${myRating.value} / 5` : "Not rated yet";
      }
    },
    {
      field: "value",
      headerName: "Rate",
      width: 100,
      renderCell: (params) => {
        const store = params.row;
        const userHasRated = store.ratings?.some(
          (rating) => rating.user_id === user?.id
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
  ], [user?.id]);

  const rows = useMemo(() => stores.map((str, index) => ({
    id: str._id || str.id || index,
    ...str,
  })), [stores]);

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
