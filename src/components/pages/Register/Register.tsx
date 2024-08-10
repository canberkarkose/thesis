import { useEffect, useState } from 'react';
import {
  Box, Typography, Button, TextField, Divider, IconButton, InputAdornment, CircularProgress
} from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import GoogleIcon from '@mui/icons-material/Google';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';

import { FirebaseError } from 'firebase/app';

import { toast } from 'react-toastify';

import { Space } from '../../atoms/Space/Space';
import { googleSignIn, signUp } from '../../../services/auth-service';

import { useAuth } from '../../../contexts/AuthContext';

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
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();

  if (signUpError) {
    toast.error(signUpError, { position: 'bottom-left' });
  }

  useEffect(() => {
    if (authLoading) return;

    if (user) {
      const timeout = setTimeout(() => {
        toast.info('You are already logged in. Accessing another account? Please log out first.', { position: 'bottom-left' });
        navigate('/app/home');
      }, 1000);
      // eslint-disable-next-line consistent-return
      return () => clearTimeout(timeout);
    }
  }, [user, authLoading, navigate]);

  if (authLoading || user || isLoading) {
    return (
      <Box display='flex' justifyContent='center' alignItems='center' minHeight='100vh'>
        <CircularProgress />
      </Box>
    );
  }

  const validateEmail = (rawEmail: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(decodeURIComponent(rawEmail));

  const handleEmailChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newEmail = event.target.value.trim().toLowerCase();
    setEmail(newEmail);

    if (newEmail.endsWith('@gmail.com')) {
      setEmailError('Please sign up with Google below for Gmail accounts.');
    } else if (!validateEmail(newEmail)) {
      setEmailError('Please enter a valid email address.');
    } else {
      setEmailError('');
    }
  };

  const validateUsername = (name: string) => name.length >= 3;
  const validatePassword = (pwd: string) => ({
    letter: /[a-zA-Z]/.test(pwd),
    numberOrSpecialChar: /[\d!@#$%^&*]/.test(pwd),
    length: pwd.length >= 7,
  });

  const passwordValidation = validatePassword(password);

  const handleUsernameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newUsername = event.target.value;
    setUsername(newUsername);
    setUsernameError(newUsername.length >= 3 && newUsername.length <= 50 ? '' : 'Username must be between 3 and 50 characters.');
    if (validateEmail(newUsername)) {
      setUsernameError('Username cannot be an email address.');
    }
  };

  const handlePasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(event.target.value);
    setPasswordInteracted(true);
  };

  const togglePasswordVisibility = () => setShowPassword(!showPassword);

  const handleSignUp = async () => {
    setSignUpAttempted(true);

    if (validateEmail(email) && validateUsername(username) && password) {
      setIsLoading(true);
      try {
        await signUp(email, username, password);
        setIsLoading(false);
        navigate('/app/account-details');
      } catch (error: unknown) {
        setIsLoading(false);
        if (error instanceof Error) {
          if (error.message === 'Username is already taken') {
            setUsernameError('Username is already taken. Please choose another.');
          } else {
            const firebaseError = error as FirebaseError;
            if (firebaseError.code === 'auth/email-already-in-use') {
              setEmailError('Email is already in use. Please log in or use a different email address.');
            } else {
              setSignUpError(`Failed to sign up. ${firebaseError.message}`);
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

  const handleGoogleSignUp = async () => {
    try {
      // Show loading spinner
      setIsLoading(true);
      // Await Google Sign-In result
      const authResult = await googleSignIn();
      const { user: signedInUser, isNewUser } = authResult;
      // Ensure the user is signed in before navigating
      if (signedInUser) {
        if (isNewUser) {
          navigate('/app/account-details');
        } else {
          navigate('/app/home');
        }
      }
    } catch (error) {
      // Handle errors and provide user feedback
      toast.error('Failed to sign in with Google. Please try again.', {
        position: 'bottom-left',
      });
    } finally {
      // Always set loading to false after attempt
      setIsLoading(false);
    }
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
          onKeyDown={(event) => {
            if (event.key === 'Enter') {
              handleSignUp();
            }
          }}
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
          onKeyDown={(event) => {
            if (event.key === 'Enter') {
              handleSignUp();
            }
          }}
          error={!!emailError}
          helperText={emailError}
          sx={{ marginBottom: 1 }}
          placeholder='name@domain.com'
        />
        <TextField
          fullWidth
          type={showPassword ? 'text' : 'password'}
          variant='outlined'
          label='Password *'
          value={password}
          onChange={handlePasswordChange}
          onKeyDown={(event) => {
            if (event.key === 'Enter') {
              handleSignUp();
            }
          }}
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
              7 characters
            </Typography>
          </Box>
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
