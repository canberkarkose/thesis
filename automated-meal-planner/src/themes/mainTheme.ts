import { createTheme } from '@mui/material/styles';

export const mainTheme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#336633', // Dark Green
    },
    secondary: {
      main: '#6A1B4D', // Berry Purple
    },
    action: {
      active: '#E59500', // Carrot Orange
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
