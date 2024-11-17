import { styled } from '@mui/material/styles';
import { Box } from '@mui/material';

export const Container = styled(Box)(({ theme }) => ({
  padding: theme.spacing(4),
  minHeight: '100vh',
  margin: '10px',
  background: '#fcfcfce4',
  borderRadius: '10px',
}));

export const GeneratedMealsContainer = styled(Box)(({ theme }) => ({
  padding: theme.spacing(4),
  backgroundColor: '#f0f4f8',
  borderRadius: theme.spacing(2),
  boxShadow: theme.shadows[3],
  width: '90%',
  margin: 'auto',
}));
