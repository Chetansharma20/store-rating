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
} from "@mui/material";
import axios from "axios";
import { DataGrid } from "@mui/x-data-grid";
import { useSelector } from "react-redux";
import api from "../config/axiosconfig";

const StoreDashBoard = () => {
  const [stores, setStores] = useState([]);
  const { user } = useSelector((state) => state.user);
  const [openDialog, setopenDialog] = useState(false);
  const [selectedRatings, setSelectedRatings] = useState([]);
  let openAddDialog = (ratings) => {
    setSelectedRatings(ratings);

    setopenDialog(true);
  };
  let closeAddDialog = () => {
    setopenDialog(false);
  };
  useEffect(() => {
    const fetchStores = async () => {
      try {
        const response = await api.post("/api/getratingsforstore", {
          owner_id: user?.id,
        });

        setStores(response.data);
      } catch (error) {
        console.error("Failed to fetch stores:", error);
      }
    };

    if (user?.id) {
      fetchStores();
    }
  }, [user]);

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
    </>
  );
};

export default StoreDashBoard;
