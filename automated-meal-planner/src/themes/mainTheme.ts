import { createTheme } from '@mui/material/styles';

export const mainTheme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#A7D3B9', // Light Green
      dark: '#607F64', // Dark Green
      light: '#9BC2A8', // Light Green
    },
    secondary: {
      main: '#8BB196',
    },
    action: {
      active: '#566D5F',
    },
    text: {
      primary: '#333333', // Dark Gray
      secondary: '#666666', // Medium Gray
    },
  },
  typography: {
    fontFamily: 'Outfit, sans-serif',
  },
});
