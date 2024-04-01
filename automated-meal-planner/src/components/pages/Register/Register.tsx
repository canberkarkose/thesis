/* eslint-disable no-console */
import { useState } from 'react';
import {
  Box, Typography, Button, TextField, Divider, IconButton, InputAdornment
} from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import GoogleIcon from '@mui/icons-material/Google';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

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
  const [currentStep, setCurrentStep] = useState(1);
  const [usernameError, setUsernameError] = useState(false);
  const [passwordInteracted, setPasswordInteracted] = useState(false);
  const [signUpAttempted, setSignUpAttempted] = useState(false);
  const [signUpError, setSignUpError] = useState('');
  const navigate = useNavigate();

  const validateEmail = (rawEmail: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(rawEmail);

  const handleEmailChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newEmail = event.target.value;
    setEmail(newEmail);
    setEmailError(validateEmail(newEmail) ? '' : 'Please enter a valid email address.');
  };

  const handleNextStep = () => {
    if (!validateEmail(email)) {
      setEmailError('Please enter a valid email address.');
    } else {
      setEmailError('');
      setCurrentStep(2);
    }
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
    setUsernameError(newUsername.length < 3 || newUsername.length > 50);
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
        await signUp(email, password);
        console.log('Sign up successful');
        navigate('/home');
      } catch (error) {
        if (error instanceof FirebaseError && error.code === 'auth/email-already-in-use') {
          console.error('Sign up failed: Email is already in use');
          setEmailError('Email is already in use.');
          setEmail('');
          setCurrentStep(1);
        } else {
          console.error('Sign up failed', error);
          setSignUpError('Failed to sign up. Please try again.');
        }
      }
    } else {
      if (!validateEmail(email)) setEmailError('Please enter a valid email address.');
      if (!validateUsername(username)) setUsernameError(true);
      if (!password) setPasswordInteracted(true);
    }
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

  const getColor = (isValid: boolean) => {
    if (!passwordInteracted && !signUpAttempted) return 'text.primary';
    return isValid ? 'success.main' : 'error.main';
  };

  const getBorderColor = (isValid: boolean) => {
    if (!passwordInteracted && !signUpAttempted) return 'grey.500';
    return isValid ? 'success.main' : 'error.main';
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
          width: '100%',
          minHeight: 'calc(100vh - 400px)',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          position: 'relative'
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
                error={!!emailError}
                helperText={emailError}
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
                onClick={handleGoogleSignUp}
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
                helperText={usernameError ? 'Username must be between 3 and 50 characters.' : 'This will show up in your profile, and you can use it to log in.'}
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
                    {passwordInteracted && (passwordValidation.letter ? <CheckCircleIcon sx={{ color: 'success.main', fontSize: 20 }} /> : null)}
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
                    {passwordInteracted && (passwordValidation.numberOrSpecialChar ? <CheckCircleIcon sx={{ color: 'success.main', fontSize: 20 }} /> : null)}
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
                    {passwordInteracted && (passwordValidation.length ? <CheckCircleIcon sx={{ color: 'success.main', fontSize: 20 }} /> : null)}
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
                sx={{ borderRadius: 20, textTransform: 'none', mb: 13 }}
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
