import {
  AppBar,
  Box,
  Button,
  Toolbar,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../reduxwork/UserSlice';

const NewAppBar = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));

  const { isLogin } = useSelector((state) => state.user);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  return (
    <AppBar
      position="static"
      sx={{
        backgroundColor: '#00695c',
        px: 2,
        boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)',
      }}
    >
      <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
       
        <Typography
          variant={isSmallScreen ? 'h6' : 'h5'}
          sx={{ fontWeight: 'bold', color: '#fff', cursor: 'pointer' }}
          onClick={() => navigate('/')}
        >
           Store Ratings
        </Typography>


        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button
            onClick={() => navigate('/stores')}
            sx={{
              color: 'white',
              textTransform: 'none',
              fontWeight: 500,
              '&:hover': {
                backgroundColor: '#004d40',
              },
            }}
          >
            Stores
          </Button>
          <Button
            onClick={() => navigate('/register')}
            sx={{
              color: 'white',
              textTransform: 'none',
              fontWeight: 500,
              '&:hover': {
                backgroundColor: '#004d40',
              },
            }}
          >
            Register
          </Button>
          <Button
            onClick={() => navigate('/updatepassword')}
            sx={{
              color: 'white',
              textTransform: 'none',
              fontWeight: 500,
              '&:hover': {
                backgroundColor: '#004d40',
              },
            }}
          >
            Update Password
          </Button>
        </Box>

    
        <Box>
          {isLogin ? (
            <Button
              variant="contained"
              onClick={handleLogout}
              sx={{
                backgroundColor: '#ffffff',
                color: '#00695c',
                fontWeight: 600,
                textTransform: 'none',
                borderRadius: 2,
                '&:hover': {
                  backgroundColor: '#004d40',
                  color: '#fff',
                },
              }}
            >
              Logout
            </Button>
          ) : (
            <Button
              variant="contained"
              onClick={() => navigate('/login')}
              sx={{
                backgroundColor: '#ffffff',
                color: '#00695c',
                fontWeight: 600,
                textTransform: 'none',
                borderRadius: 2,
                '&:hover': {
                  backgroundColor: '#004d40',
                  color: '#fff',
                },
              }}
            >
              Login
            </Button>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default NewAppBar;
