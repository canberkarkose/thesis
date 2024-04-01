/* eslint-disable no-console */
import {
  Box, Typography, Button, TextField, Divider, IconButton, InputAdornment
} from '@mui/material';
import { Link } from 'react-router-dom';
import GoogleIcon from '@mui/icons-material/Google';
import FacebookIcon from '@mui/icons-material/Facebook';
import AppleIcon from '@mui/icons-material/Apple';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';

import { useState } from 'react';

import { Space } from '../../atoms/Space/Space';

import { ContentContainer } from './Login.styles';

export const Login = () => {
  const [usernameOrEmail, setUsernameOrEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleUsernameOrEmailChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setUsernameOrEmail(event.target.value);
  };

  const handlePasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(event.target.value);
  };

  const togglePasswordVisibility = () => setShowPassword(!showPassword);

  const handleSignIn = () => {
    console.log('Sign in logic here');
  };

  return (
    <ContentContainer>
      <Box sx={{
        padding: 3,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
      }}
      >
        <Box sx={{
          display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 2, position: 'relative', width: '100%'
        }}
        >
          <Typography variant='h4' sx={{ fontWeight: 'bold', textAlign: 'center' }}>
            Sign in to Bite by Byte
          </Typography>
        </Box>
        <Box sx={{
          width: '100%', minHeight: 'calc(100vh - 400px)', display: 'flex', flexDirection: 'column', justifyContent: 'center'
        }}
        >
          <Typography variant='subtitle2' sx={{ alignSelf: 'flex-start', fontWeight: 'bold', mb: 1 }}>
            Email or username
          </Typography>
          <TextField
            fullWidth
            variant='outlined'
            value={usernameOrEmail}
            onChange={handleUsernameOrEmailChange}
            sx={{ marginBottom: 3 }}
            placeholder='Email or username'
          />
          <Typography variant='subtitle2' sx={{ alignSelf: 'flex-start', fontWeight: 'bold', mb: 1 }}>
            Password
          </Typography>
          <TextField
            fullWidth
            type={showPassword ? 'text' : 'password'}
            variant='outlined'
            value={password}
            onChange={handlePasswordChange}
            InputProps={{
              endAdornment: (
                <InputAdornment position='end'>
                  <IconButton onClick={togglePasswordVisibility}>
                    {showPassword ? <VisibilityIcon /> : <VisibilityOffIcon />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
            sx={{ marginBottom: 3 }}
          />
          <Button
            fullWidth
            variant='contained'
            color='secondary'
            onClick={handleSignIn}
            sx={{ borderRadius: 20, textTransform: 'none' }}
          >
            <Typography fontSize='18px'>Log In</Typography>
          </Button>
          <Space s24 />
          <Divider sx={{ margin: '20px 0', position: 'relative' }}>
            <Typography
              sx={{
                position: 'absolute', top: '-12px', left: 'calc(50% - 16px)', padding: '0 10px'
              }}
            >
              or
            </Typography>
          </Divider>
          <Space s24 />
          <Button
            fullWidth
            variant='outlined'
            sx={{
              color: 'black', borderColor: 'black', mb: 1, borderRadius: 20, textTransform: 'none',
            }}
          >
            <Box sx={{
              width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center'
            }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <GoogleIcon sx={{ mr: 7, color: 'red' }} />
                <Typography fontSize='18px'>Continue with Google</Typography>
              </Box>
            </Box>
          </Button>
          <Button
            fullWidth
            variant='outlined'
            sx={{
              color: 'black', borderColor: 'black', mb: 1, borderRadius: 20, textTransform: 'none',
            }}
          >
            <Box sx={{
              width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center'
            }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <FacebookIcon sx={{ mr: 7, color: 'blue' }} />
                <Typography fontSize='18px'>Continue with Facebook</Typography>
              </Box>
            </Box>
          </Button>
          <Button
            fullWidth
            variant='outlined'
            sx={{
              color: 'black', borderColor: 'black', mb: 1, borderRadius: 20, textTransform: 'none',
            }}
          >
            <Box sx={{
              width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center'
            }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <AppleIcon sx={{ mr: 7, color: 'black' }} />
                <Typography fontSize='18px'>Continue with Apple</Typography>
              </Box>
            </Box>
          </Button>

          <Space s24 />
          <Divider sx={{ margin: '20px 0' }} />
          <Space s24 />
          <Typography textAlign='center'>
            Don’t have an account yet?
            {' '}
            <Link to='/register'>Sign up to Bite by Byte!</Link>
          </Typography>
        </Box>
      </Box>
    </ContentContainer>
  );
};
