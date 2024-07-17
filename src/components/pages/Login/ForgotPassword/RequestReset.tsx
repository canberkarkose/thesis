import { useEffect, useState } from 'react';
import {
  Box,
  Button,
  CircularProgress,
  TextField,
  Typography
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

import { resetPassword } from '../../../../services/auth-service';

import { ContentContainer } from '../Login.styles';
import { useAuth } from '../../../../contexts/AuthContext';

export const RequestReset = () => {
  const [email, setEmail] = useState('');
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && user) {
      if (!localStorage.getItem('justLoggedIn')) {
        setTimeout(() => {
          toast.info('You are already logged in. Accessing another account? Please log out first.', { position: 'bottom-left' });
        }, 1000);
      } else {
        localStorage.removeItem('justLoggedIn');
      }
      setTimeout(() => {
        navigate('/app/home');
      }, 1000);
    }
  }, [user, loading, navigate]);

  if (loading || user) {
    return (
      <Box display='flex' justifyContent='center' alignItems='center' minHeight='100vh'>
        <CircularProgress />
      </Box>
    );
  }

  const handleSubmit = async () => {
    if (!email) {
      toast.error('Please enter your email.', { position: 'bottom-left' });
      return;
    }
    try {
      await resetPassword(email);
      toast.info('Password reset email sent. Please check your inbox.', { position: 'bottom-left' });
      navigate('/login');
    } catch (error) {
      toast.error('Failed to send reset email. Please try again.', { position: 'bottom-left' });
    }
  };

  return (
    <ContentContainer>
      <Box sx={{
        padding: 3,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh'
      }}
      >
        <Typography variant='h4' sx={{ fontWeight: 'bold', textAlign: 'center', marginBottom: 2 }}>
          Request Password Reset
        </Typography>
        <TextField
          fullWidth
          variant='outlined'
          label='Email Address'
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          onKeyDown={(event) => {
            if (event.key === 'Enter') {
              handleSubmit();
            }
          }}
          sx={{ marginBottom: 4, mt: 3 }}
        />
        <Button onClick={handleSubmit} variant='contained' sx={{ borderRadius: 10, textTransform: 'none' }}>
          Send Reset Email
        </Button>
      </Box>
    </ContentContainer>
  );
};