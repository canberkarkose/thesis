import styled from '@mui/material/styles/styled';
import { Box } from '@mui/material';

export const GroceryTableContainer = styled(Box)<{
  hasCheckboxes: boolean
}>(({ theme, hasCheckboxes }) => ({
  maxWidth: '1000px',
  margin: '0 auto',
  padding: theme.spacing(2),
  maxHeight: hasCheckboxes ? '70vh' : '500px',
  minHeight: hasCheckboxes ? '70vh' : '500px',
  overflowY: 'auto',
  borderRadius: '8px',
  background: 'rgba(255, 255, 255, 0.8)',
  boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)',
  marginTop: theme.spacing(2),
}));
