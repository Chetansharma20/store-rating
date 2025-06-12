import React, { useState } from 'react';
import {
  AppBar,
  Box,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Typography,
  Button,
  Divider,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';

import MenuIcon from '@mui/icons-material/Menu';
import PersonAddAlt1Icon from '@mui/icons-material/PersonAddAlt1';
import DashboardCustomizeIcon from '@mui/icons-material/DashboardCustomize';
import StoreIcon from '@mui/icons-material/Store';
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';
import LogoutIcon from '@mui/icons-material/Logout';
import LoginIcon from '@mui/icons-material/Login';

import { useDispatch, useSelector } from 'react-redux';
import { logout } from './reduxwork/UserSlice';

const Draweradmin = () => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isLogin } = useSelector((state) => state.user);

  const handleDrawerOpen = () => setIsDrawerOpen(true);
  const handleDrawerClose = () => setIsDrawerOpen(false);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  return (
    <>
      {/* AppBar */}
      <AppBar
        position="fixed"
        sx={{
          backgroundColor: '#1a237e',
          boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)',
        }}
      >
        <Toolbar sx={{ justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <IconButton
              size="large"
              edge="start"
              color="inherit"
              onClick={handleDrawerOpen}
              sx={{ mr: 2 }}
            >
              <MenuIcon />
            </IconButton>
            <Typography variant="h6" fontWeight="bold" color="inherit">
              System Admin Panel
            </Typography>
          </Box>
          {isLogin ? (
            <Button
              color="inherit"
              startIcon={<LogoutIcon />}
              onClick={handleLogout}
              sx={{
                textTransform: 'none',
                fontWeight: 500,
              }}
            >
              Logout
            </Button>
          ) : (
            <Button
              color="inherit"
              startIcon={<LoginIcon />}
              onClick={() => navigate('/login')}
              sx={{
                textTransform: 'none',
                fontWeight: 500,
              }}
            >
              Login
            </Button>
          )}
        </Toolbar>
      </AppBar>

      {/* Drawer */}
      <Drawer
        open={isDrawerOpen}
        onClose={handleDrawerClose}
        sx={{
          '& .MuiDrawer-paper': {
            backgroundColor: '#f9f9f9',
            width: 260,
            paddingTop: 2,
          },
        }}
      >
        <Box>
          <Typography variant="h6" sx={{ px: 2, pb: 1, fontWeight: 'bold' }}>
            Navigation
          </Typography>
        </Box>

        <Divider />

        <List>
          <ListItem
            button
            onClick={() => {
              navigate('/');
              handleDrawerClose();
            }}
          >
            <ListItemIcon>
              <DashboardCustomizeIcon color="primary" />
            </ListItemIcon>
            <ListItemText primary="Admin Dashboard" />
          </ListItem>

          <ListItem
            button
            onClick={() => {
              navigate('/adduser');
              handleDrawerClose();
            }}
          >
            <ListItemIcon>
              <PersonAddAlt1Icon color="primary" />
            </ListItemIcon>
            <ListItemText primary="Add User" />
          </ListItem>

          <ListItem
            button
            onClick={() => {
              navigate('/storemanagement');
              handleDrawerClose();
            }}
          >
            <ListItemIcon>
              <StoreIcon color="primary" />
            </ListItemIcon>
            <ListItemText primary="Store Management" />
          </ListItem>

          <ListItem
            button
            onClick={() => {
              navigate('/usermanagement');
              handleDrawerClose();
            }}
          >
            <ListItemIcon>
              <PeopleAltIcon color="primary" />
            </ListItemIcon>
            <ListItemText primary="User Management" />
          </ListItem>
        </List>
      </Drawer>

      {/* Spacer for AppBar */}
      <Box sx={{ height: 64 }} />
    </>
  );
};

export default Draweradmin;
