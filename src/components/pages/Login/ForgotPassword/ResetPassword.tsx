import { useEffect, useState } from 'react';
import {
  Box,
  Button,
  TextField,
  Typography,
  CircularProgress,
  InputAdornment,
  IconButton,
} from '@mui/material';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';

import { Space } from '../../../atoms/Space/Space';

import { confirmPassword } from '../../../../services/auth-service';
import { ContentContainer } from '../Login.styles';
import { useAuth } from '../../../../contexts/AuthContext';

import { GlobalBackground } from '@components/pages/LandingPage/LandingPage.styles';

export const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const [newPassword, setNewPassword] = useState('');
  const [passwordConfirmation, setPasswordConfirmation] = useState('');
  const [passwordInteracted, setPasswordInteracted] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [changeAttempted, setChangeAttempted] = useState(false);
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [redirected, setRedirected] = useState(false);

  useEffect(() => {
    if (!loading && user) {
      if (!localStorage.getItem('justLoggedIn')) {
        setTimeout(() => {
          toast.info('You are already logged in. Please log out first.', { position: 'bottom-left' });
        }, 1000);
      } else {
        localStorage.removeItem('justLoggedIn');
      }
      setTimeout(() => {
        setRedirected(true);
        navigate('/app/dashboard');
      }, 1000);
    }
  }, [user, loading, navigate]);

  useEffect(() => {
    if (!redirected) {
      const oobCode = searchParams.get('oobCode');
      if (!oobCode) {
        toast.error('No reset code provided.', { position: 'bottom-left' });
        navigate('/login');
      }
    }
  }, [navigate, searchParams, redirected]);

  if (loading || user) {
    return (
      <Box display='flex' justifyContent='center' alignItems='center' minHeight='100vh'>
        <CircularProgress />
      </Box>
    );
  }

  const getColor = (isValid: boolean) => {
    if (!passwordInteracted && !changeAttempted) return 'text.primary';
    return isValid ? 'success.main' : 'error.main';
  };

  const getBorderColor = (isValid: boolean) => {
    if (!passwordInteracted && !changeAttempted) return 'grey.500';
    return isValid ? 'success.main' : 'error.main';
  };

  const validatePassword = (pwd: string) => ({
    letter: /[a-zA-Z]/.test(pwd),
    numberOrSpecialChar: /[\d!@#$%^&*]/.test(pwd),
    length: pwd.length >= 7,
  });

  const handleSubmit = async () => {
    setChangeAttempted(true);
    if (newPassword !== passwordConfirmation) {
      toast.error('Passwords do not match.', { position: 'bottom-left' });
      return;
    }

    const validationResults = validatePassword(newPassword);
    if (!validationResults.letter
      || !validationResults.numberOrSpecialChar
      || !validationResults.length) {
      toast.error('Password does not meet complexity requirements.', { position: 'bottom-left' });
      return;
    }

    try {
      const oobCode = searchParams.get('oobCode')!;
      await confirmPassword(oobCode, newPassword);
      toast.success('Your password has been reset successfully.', { position: 'bottom-left' });
      navigate('/login');
    } catch (error) {
      console.error(error);
      toast.error('Failed to reset password. Please try again.', { position: 'bottom-left' });
    }
  };

  const passwordValidation = validatePassword(newPassword);

  const togglePasswordVisibility = () => setShowPassword(!showPassword);

  return (
    <GlobalBackground>
      <ContentContainer>
        <Box sx={{
          padding: 3,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          height: '100vh'
        }}
        >
          <Typography variant='h4' sx={{ fontWeight: 'bold', textAlign: 'center', marginBottom: 2 }}>
            Set New Password
          </Typography>
          <TextField
            fullWidth
            type={showPassword ? 'text' : 'password'}
            variant='outlined'
            label='New Password'
            error={changeAttempted && !passwordValidation.letter}
            value={newPassword}
            onChange={(e) => {
              setNewPassword(e.target.value);
              setPasswordInteracted(true);
            }}
            slotProps={{
              input: {
                endAdornment: (
                  <InputAdornment position='end'>
                    <IconButton onClick={togglePasswordVisibility}>
                      {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                    </IconButton>
                  </InputAdornment>
                ),
              }
            }}
            sx={{ marginBottom: 2, mt: 3 }}
          />

          <TextField
            fullWidth
            error={changeAttempted && newPassword !== passwordConfirmation}
            type={showPassword ? 'text' : 'password'}
            variant='outlined'
            label='Confirm Password'
            value={passwordConfirmation}
            onChange={(e) => setPasswordConfirmation(e.target.value)}
            sx={{ marginBottom: 2 }}
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
          <Button onClick={handleSubmit} variant='contained' sx={{ borderRadius: 20, textTransform: 'none' }}>
            Reset Password
          </Button>
        </Box>
      </ContentContainer>
    </GlobalBackground>
  );
};
