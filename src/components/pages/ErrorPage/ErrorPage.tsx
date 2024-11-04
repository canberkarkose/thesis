import { Box, Button, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';

interface ErrorPageProps {
  errorCode?: number;
  errorMessage?: string;
  isAuthenticated: boolean;
}

export const ErrorPage = ({ errorCode = 404, errorMessage = 'Page Not Found', isAuthenticated }: ErrorPageProps) => {
  const navigate = useNavigate();

  const handleGoBack = () => {
    if (isAuthenticated) {
      navigate('/app/dashboard');
    } else {
      navigate('/');
    }
  };

  return (
    <Box
      display='flex'
      flexDirection='column'
      alignItems='center'
      justifyContent='center'
      minHeight='100vh'
      textAlign='center'
    >
      <Typography variant='h1' fontWeight='bold' color='error'>
        {errorCode}
      </Typography>
      <Typography variant='h5' marginBottom='16px'>
        {errorMessage}
      </Typography>
      <Button variant='contained' color='primary' onClick={handleGoBack}>
        {isAuthenticated ? 'Go back to Dashboard' : 'Go to Home'}
      </Button>
    </Box>
  );
};
