import styled from '@mui/material/styles/styled';
import { Box } from '@mui/material';

export const GroceryTableContainer = styled(Box)(({ theme }) => ({
  maxWidth: '1000px',
  margin: '0 auto',
  padding: theme.spacing(2),
  maxHeight: '70vh',
  minHeight: '70vh',
  overflowY: 'auto',
  backgroundColor: '#ffffff',
  borderRadius: theme.shape.borderRadius,
  marginTop: theme.spacing(2),
}));
