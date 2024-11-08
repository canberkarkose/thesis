import {
  IconButton,
  Menu,
  MenuItem,
  Typography,
} from '@mui/material';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import { toast } from 'react-toastify';

import {
  HeaderContainer, LogoContainer, AccountActions, HeaderContent
} from './AppHeader.styles';

import { BTBLogo } from '@src/assets';
import { logout } from '@src/services/auth-service';

export const AppHeader = () => {
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = async () => {
    try {
      await logout();
      handleClose();
      navigate('/login');
    } catch (error) {
      console.error('Logout failed:', error);
      toast.error('Logout failed. Please try again.');
    }
  };

  return (
    <HeaderContainer>
      <HeaderContent>
        <LogoContainer>
          <Link to='/app/dashboard' style={{ textDecoration: 'none', display: 'flex', alignItems: 'center' }}>
            <BTBLogo />
            <Typography
              variant='h5'
              component='h1'
              sx={{
                fontWeight: 'bold', color: 'white', lineHeight: 1.2, mb: '15%'
              }}
            >
              Bite
              <br />
              by
              <br />
              Byte
            </Typography>
          </Link>
        </LogoContainer>
        <AccountActions>
          <IconButton
            size='large'
            aria-label='account of current user'
            aria-controls='menu-appbar'
            aria-haspopup='true'
            onClick={handleMenu}
            color='inherit'
          >
            <AccountCircleIcon style={{ fontSize: '40px' }} />
            {' '}
          </IconButton>
          <Menu
            id='menu-appbar'
            anchorEl={anchorEl}
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'right',
            }}
            keepMounted
            transformOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
            open={Boolean(anchorEl)}
            onClose={handleClose}
          >
            <MenuItem onClick={handleClose}>Profile</MenuItem>
            <MenuItem onClick={handleClose}>Account</MenuItem>
            <MenuItem onClick={handleLogout}>Logout</MenuItem>
          </Menu>
        </AccountActions>
      </HeaderContent>
    </HeaderContainer>
  );
};
