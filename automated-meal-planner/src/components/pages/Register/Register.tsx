/* eslint-disable no-console */
import { useState } from 'react';
import {
  Box, Typography, Button, TextField, Divider, IconButton, InputAdornment
} from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import GoogleIcon from '@mui/icons-material/Google';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';

import { FirebaseError } from 'firebase/app';

import { Space } from '../../atoms/Space/Space';
import { googleSignIn, signUp } from '../../../services/auth-service';

import { ContentContainer } from './Register.styles';

export const Register = () => {
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [usernameError, setUsernameError] = useState('');
  const [signUpAttempted, setSignUpAttempted] = useState(false);
  const [passwordInteracted, setPasswordInteracted] = useState(false);
  const [signUpError, setSignUpError] = useState('');
  const navigate = useNavigate();

  const validateEmail = (rawEmail: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(rawEmail);

  const handleEmailChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newEmail = event.target.value;
    setEmail(newEmail);
    setEmailError(validateEmail(newEmail) ? '' : 'Please enter a valid email address.');
  };

  const validateUsername = (name: string) => name.length >= 3;
  const validatePassword = (pwd: string) => ({
    letter: /[a-zA-Z]/.test(pwd),
    numberOrSpecialChar: /[\d!@#$%^&*]/.test(pwd),
    length: pwd.length >= 10,
  });

  const passwordValidation = validatePassword(password);

  const handleUsernameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newUsername = event.target.value;
    setUsername(newUsername);
    setUsernameError(newUsername.length >= 3 && newUsername.length <= 50 ? '' : 'Username must be between 3 and 50 characters.');
  };

  const handlePasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(event.target.value);
    setPasswordInteracted(true);
  };

  const togglePasswordVisibility = () => setShowPassword(!showPassword);

  const handleSignUp = async () => {
    setSignUpAttempted(true);
    if (validateEmail(email) && validateUsername(username) && password) {
      try {
        await signUp(email, username, password);
        navigate('/home');
      } catch (error: unknown) {
        if (error instanceof Error) {
          if (error.message === 'Username is already taken') {
            setUsernameError('Username is already taken.');
          } else {
            const firebaseError = error as FirebaseError;
            if (firebaseError.code === 'auth/email-already-in-use') {
              setEmailError('Email is already in use.');
            } else {
              setSignUpError('Failed to sign up. Please try again.');
            }
          }
        } else {
          setSignUpError('An unexpected error occurred. Please try again.');
        }
      }
    } else {
      if (!validateEmail(email)) setEmailError('Please enter a valid email address.');
      if (!validateUsername(username)) setUsernameError('Username must be between 3 and 50 characters.');
      if (!password) setPasswordInteracted(true);
    }
  };

  const getColor = (isValid: boolean) => {
    if (!passwordInteracted && !signUpAttempted) return 'text.primary';
    return isValid ? 'success.main' : 'error.main';
  };

  const getBorderColor = (isValid: boolean) => {
    if (!passwordInteracted && !signUpAttempted) return 'grey.500';
    return isValid ? 'success.main' : 'error.main';
  };

  const handleGoogleSignUp = () => {
    googleSignIn().then((result) => {
      const { user } = result;
      if (user) {
        console.log(user);
        navigate('/home');
      }
    }).catch((error) => {
      console.error(error);
    });
  };

  return (
    <ContentContainer>
      <Box sx={{
        padding: 3, display: 'flex', flexDirection: 'column', justifyContent: 'center'
      }}
      >
        <Typography variant='h4' sx={{ fontWeight: 'bold', textAlign: 'center', marginBottom: 2 }}>
          Sign up to Bite by Byte
        </Typography>
        <Space s24 />
        <TextField
          fullWidth
          variant='outlined'
          label='Username *'
          value={username}
          onChange={handleUsernameChange}
          error={!!usernameError}
          helperText={usernameError}
          sx={{ marginBottom: 1 }}
        />
        <TextField
          fullWidth
          variant='outlined'
          label='Email address *'
          value={email}
          onChange={handleEmailChange}
          error={!!emailError}
          helperText={emailError}
          sx={{ marginBottom: 1 }}
          placeholder='name@domain.com'
        />
        <TextField
          fullWidth
          type={showPassword ? 'text' : 'password'}
          variant='outlined'
          label='Password'
          value={password}
          onChange={handlePasswordChange}
          error={passwordInteracted && (password.length === 0
              || !passwordValidation.letter
              || !passwordValidation.numberOrSpecialChar
              || !passwordValidation.length)}
          InputProps={{
            endAdornment: (
              <InputAdornment position='end'>
                <IconButton onClick={togglePasswordVisibility}>
                  {showPassword ? <VisibilityIcon /> : <VisibilityOffIcon />}
                </IconButton>
              </InputAdornment>
            ),
          }}
          sx={{ marginBottom: 1 }}
        />
        <Space s12 />
        <Typography variant='subtitle2' sx={{ fontWeight: 'bold' }}>
          Your password must contain at least:
        </Typography>
        <Space s12 />
        <Box sx={{ display: 'flex', flexDirection: 'column', mb: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Box sx={{
              width: 20,
              height: 20,
              borderRadius: '50%',
              border: '1px solid',
              borderColor: getBorderColor(passwordValidation.letter),
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              mr: 1
            }}
            >
              {passwordInteracted && (passwordValidation.letter ? <CheckCircleIcon sx={{ color: 'success.main', fontSize: 20 }} /> : <CancelIcon sx={{ color: 'error.main', fontSize: 20 }} />)}
            </Box>
            <Typography variant='subtitle2' color={getColor(passwordValidation.letter)}>
              1 letter
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Box sx={{
              width: 20,
              height: 20,
              borderRadius: '50%',
              border: '1px solid',
              borderColor: getBorderColor(passwordValidation.numberOrSpecialChar),
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              mr: 1
            }}
            >
              {passwordInteracted && (passwordValidation.numberOrSpecialChar ? <CheckCircleIcon sx={{ color: 'success.main', fontSize: 20 }} /> : <CancelIcon sx={{ color: 'error.main', fontSize: 20 }} />)}
            </Box>
            <Typography variant='subtitle2' color={getColor(passwordValidation.numberOrSpecialChar)}>
              1 number or special character
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Box sx={{
              width: 20,
              height: 20,
              borderRadius: '50%',
              border: '1px solid',
              borderColor: getBorderColor(passwordValidation.length),
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              mr: 1
            }}
            >
              {passwordInteracted && (passwordValidation.length ? <CheckCircleIcon sx={{ color: 'success.main', fontSize: 20 }} /> : <CancelIcon sx={{ color: 'error.main', fontSize: 20 }} />)}
            </Box>
            <Typography variant='subtitle2' color={getColor(passwordValidation.length)}>
              10 characters
            </Typography>
          </Box>
        </Box>
        {signUpError && (
        <Typography color='error' sx={{ textAlign: 'center', mb: 2 }}>
          {signUpError}
        </Typography>
        )}
        <Button
          fullWidth
          variant='contained'
          color='secondary'
          onClick={handleSignUp}
          sx={{ borderRadius: 20, textTransform: 'none' }}
        >
          <Typography fontSize='18px'>Sign Up</Typography>
        </Button>
        <Space s12 />
        <Divider sx={{ margin: '20px 0', position: 'relative' }}>
          <Typography
            sx={{
              position: 'absolute', top: '-12px', left: 'calc(50% - 16px)', padding: '0 10px'
            }}
          >
            or
          </Typography>
        </Divider>
        <Space s12 />
        <Button
          fullWidth
          variant='outlined'
          onClick={handleGoogleSignUp}
          sx={{
            color: 'black', borderColor: 'black', borderRadius: 20, textTransform: 'none',
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <GoogleIcon sx={{ mr: 2, color: 'red' }} />
            <Typography fontSize='18px'>Sign up with Google</Typography>
          </Box>
        </Button>
        <Typography textAlign='center' sx={{ marginTop: 2 }}>
          Already have an account?
          {' '}
          <Link to='/login'>Log in here.</Link>
        </Typography>
      </Box>
    </ContentContainer>
  );
};
