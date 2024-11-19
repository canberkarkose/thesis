import styled from '@mui/material/styles/styled';
import { Box, ToggleButton, ToggleButtonGroup } from '@mui/material';

export const GroceryListContainer = styled(Box)`
  max-width: 800px;
  margin: 0 auto;
  padding: 16px;
  max-height: 600px;
  overflow-y: auto;
  background-color: #ffffff; /* White background */
  border-radius: 8px;
`;

export const StyledToggleButtonGroup = styled(ToggleButtonGroup)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'center',
  marginBottom: theme.spacing(2),
}));

export const StyledToggleButton = styled(ToggleButton)(() => ({
  flex: 1,
  borderRadius: 25,
  border: 'none',
  flexGrow: 1,
  flexBasis: 0,
  minWidth: 0,
  textTransform: 'none',
  fontWeight: 'bold',
  fontSize: '16px',
  color: '#000000',
  backgroundColor: '#FFFFFF',
  '&.Mui-selected': {
    color: '#FFFFFF',
    backgroundColor: '#5c9c3e',
  },
  '&:hover': {
    backgroundColor: '#e0e0e0',
  },
  '&.Mui-selected:hover': {
    backgroundColor: '#406d2b',
  },
}));
