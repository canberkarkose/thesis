import { styled } from '@mui/material/styles';
import { Box } from '@mui/material';

export const Container = styled(Box)(({ theme }) => ({
  maxWidth: '800px',
  margin: '0 auto',
  padding: theme.spacing(4),
  background: '#fcfcfce4',
  borderRadius: '10px',
}));
