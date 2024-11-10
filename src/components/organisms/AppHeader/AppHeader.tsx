// AppHeader.tsx

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

import { dataTestIds } from '../../../dataTest/dataTestIds';

import { BTBLogo } from '../../../assets'; // TODO: should be able to use @src directly but cant check it later

import { logout } from '../../../services/auth-service';

import {
  HeaderContainer, LogoContainer, AccountActions, HeaderContent
} from './AppHeader.styles';

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
    <HeaderContainer data-testid={dataTestIds.components.appHeader.container}>
      <HeaderContent>
        <LogoContainer data-testid={dataTestIds.components.appHeader.logo}>
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
            data-testid={dataTestIds.components.appHeader.accountButton}
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
            data-testid={dataTestIds.components.appHeader.menu}
          >
            <MenuItem
              onClick={handleClose}
              data-testid={dataTestIds.components.appHeader.menuItemProfile}
            >
              Profile
            </MenuItem>
            <MenuItem
              onClick={handleClose}
              data-testid={dataTestIds.components.appHeader.menuItemAccount}
            >
              Account
            </MenuItem>
            <MenuItem
              onClick={handleLogout}
              data-testid={dataTestIds.components.appHeader.menuItemLogout}
            >
              Logout
            </MenuItem>
          </Menu>
        </AccountActions>
      </HeaderContent>
    </HeaderContainer>
  );
};
