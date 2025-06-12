import React from 'react';
import {
  AppBar,
  Box,
  Button,
  List,
  ListItem,
  ListItemText,
  Toolbar,
  Typography,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from './reduxwork/UserSlice';

const Draweradmin = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isLogin } = useSelector((state) => state.user);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  return (
    <>
      <AppBar
        position="fixed"
        sx={{
          background: 'linear-gradient(to right, #1e3c72, #2a5298)', 
          boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)',
        }}
      >
        <Toolbar sx={{ justifyContent: 'space-between', px: 2 }}>
          {/* Left side - Logo/Title + Navigation */}
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Typography variant="h6" color="inherit" fontWeight={600} mr={3}>
              Store Owner
            </Typography>

            <List sx={{ display: 'flex', flexDirection: 'row', p: 0 }}>
              <ListItem
                onClick={() => navigate('/')}
                sx={{
                  cursor: 'pointer',
                  mx: 0.5,
                  px: 1.5,
                  borderRadius: 1,
                  transition: '0.3s',
                  '&:hover': {
                    backgroundColor: '#3b5998',
                    transform: 'scale(1.03)',
                  },
                }}
              >
                <ListItemText
                  primary="Dashboard"
                  primaryTypographyProps={{
                    color: 'white',
                    fontWeight: 500,
                    letterSpacing: 0.5,
                  }}
                />
              </ListItem>
            </List>
          </Box>

         
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Button
              onClick={() => navigate('/updatepassword')}
              sx={{
                color: 'white',
                fontWeight: 500,
                textTransform: 'none',
                mx: 1,
                '&:hover': {
                  backgroundColor: '#3b5998',
                },
              }}
            >
              Update Password
            </Button>

            {isLogin ? (
              <Button
                variant="outlined"
                color="inherit"
                onClick={handleLogout}
                sx={{
                  borderColor: 'white',
                  color: 'white',
                  textTransform: 'none',
                  '&:hover': {
                    backgroundColor: '#3b5998',
                    borderColor: '#ecf0f1',
                  },
                }}
              >
                Logout
              </Button>
            ) : (
              <Button
                variant="outlined"
                color="inherit"
                onClick={() => navigate('/login')}
                sx={{
                  borderColor: 'white',
                  color: 'white',
                  textTransform: 'none',
                  '&:hover': {
                    backgroundColor: '#3b5998',
                    borderColor: '#ecf0f1',
                  },
                }}
              >
                Login
              </Button>
            )}
          </Box>
        </Toolbar>
      </AppBar>

      <Box sx={{ height: 64 }} />
    </>
  );
};

export default Draweradmin;
 