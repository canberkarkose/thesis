/* eslint-disable no-console */
import {
  Box, Typography, Button, TextField, Divider, IconButton, InputAdornment
} from '@mui/material';
import { Link } from 'react-router-dom';
import GoogleIcon from '@mui/icons-material/Google';
import FacebookIcon from '@mui/icons-material/Facebook';
import AppleIcon from '@mui/icons-material/Apple';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

import { useState } from 'react';

import { Space } from '../../atoms/Space/Space';

import { ContentContainer } from './Register.styles';

export const Register = () => {
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [usernameError, setUsernameError] = useState(false);

  const handleEmailChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(event.target.value);
    if (emailError) setEmailError(false);
  };

  const validateEmail = (rawEmail: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(rawEmail);
  };

  const handleNextStep = () => {
    if (!validateEmail(email)) {
      setEmailError(true);
      console.log('Invalid email');
    } else {
      setEmailError(false);
      setCurrentStep(2);
    }
  };

  const validateUsername = (name: string) => name.length >= 3;
  const validatePassword = (pwd: string) => ({
    letter: /[a-zA-Z]/.test(pwd),
    numberOrSpecialChar: /[\d!@#$%^&*]/.test(pwd),
    length: pwd.length >= 10,
  });

  const handleUsernameChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => setUsername(event.target.value);
  const handlePasswordChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => setPassword(event.target.value);
  const togglePasswordVisibility = () => setShowPassword(!showPassword);

  const handleSignUp = () => {
    if (!validateUsername(username)) {
      setUsernameError(true);
      console.log('Username is too short');
    } else {
      setUsernameError(false);
      const passwordValidation = validatePassword(password);
      if (
        !passwordValidation.letter
        || !passwordValidation.numberOrSpecialChar
        || !passwordValidation.length
      ) {
        console.log('Password does not meet the criteria');
      } else {
        console.log('Sign up successful');
        // Proceed with sign-up logic
      }
    }
  };

  const passwordValidation = validatePassword(password);

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
          {currentStep === 2 && (
          <IconButton onClick={() => setCurrentStep(1)} sx={{ position: 'absolute', left: -45 }}>
            <ArrowBackIcon />
          </IconButton>
          )}
          <Typography variant='h4' sx={{ fontWeight: 'bold', textAlign: 'center' }}>
            Sign up to Bite by Byte
          </Typography>
        </Box>
        <Box sx={{
          width: '100%', minHeight: 'calc(100vh - 400px)', display: 'flex', flexDirection: 'column', justifyContent: 'center'
        }}
        >
          {currentStep === 1 && (
          <>
            <Typography variant='subtitle2' sx={{ alignSelf: 'flex-start', fontWeight: 'bold', mb: 1 }}>
              Email address
            </Typography>
            <TextField
              fullWidth
              variant='outlined'
              value={email}
              onChange={handleEmailChange}
              error={emailError}
              helperText={emailError && 'Please enter a valid email address.'}
              sx={{ marginBottom: 3 }}
              placeholder='name@domain.com'
            />
            <Button
              fullWidth
              variant='contained'
              color='secondary'
              onClick={handleNextStep}
              sx={{ borderRadius: 20, textTransform: 'none' }}
            >
              <Typography fontSize='18px'>Next</Typography>
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
                  <Typography fontSize='18px'>Sign up with Google</Typography>
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
                  <Typography fontSize='18px'>Sign up with Facebook</Typography>
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
                  <Typography fontSize='18px'>Sign up with Apple</Typography>
                </Box>
              </Box>
            </Button>
            <Space s24 />
            <Divider sx={{ margin: '20px 0' }} />
            <Space s24 />
            <Typography textAlign='center'>
              Already have an account?
              {' '}
              <Link to='/login'>Log in here.</Link>
            </Typography>
          </>
          )}
          {currentStep === 2 && (
          <>
            <Typography variant='subtitle2' sx={{ alignSelf: 'flex-start', fontWeight: 'bold', mb: 1 }}>
              Username
            </Typography>
            <TextField
              fullWidth
              variant='outlined'
              value={username}
              onChange={handleUsernameChange}
              error={usernameError}
              helperText={usernameError ? 'Username must be at least 3 characters.' : 'This will show up in your profile, and you can use it to log in.'}
              sx={{ marginBottom: 3 }}
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
                      {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              sx={{ marginBottom: 1 }}
            />
            <Typography variant='subtitle2' sx={{ fontWeight: 'bold' }}>
              Your password must contain at least:
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', mb: 2 }}>
              <Typography variant='subtitle2' color={passwordValidation.letter ? 'success.main' : 'error.main'}>
                <CheckCircleIcon />
                {' '}
                1 letter
              </Typography>
              <Typography variant='subtitle2' color={passwordValidation.numberOrSpecialChar ? 'success.main' : 'error.main'}>
                <CheckCircleIcon />
                {' '}
                1 number or special character (e.g., ? # ! $)
              </Typography>
              <Typography variant='subtitle2' color={passwordValidation.length ? 'success.main' : 'error.main'}>
                <CheckCircleIcon />
                {' '}
                10 characters
              </Typography>
            </Box>
            <Button
              fullWidth
              variant='contained'
              color='secondary'
              onClick={handleSignUp}
              sx={{ borderRadius: 20, textTransform: 'none' }}
            >
              <Typography fontSize='18px'>Sign Up</Typography>
            </Button>
          </>
          )}
        </Box>
      </Box>
    </ContentContainer>
  );
};
