import { CssBaseline, ThemeProvider } from '@mui/material';

import { ToastContainer } from 'react-toastify';

import { AppRoutes } from './routing/AppRoutes.tsx';

import { mainTheme } from './themes/mainTheme.ts';
import { PageWrapper } from './App.styles.ts';

function App() {
  return (
    <PageWrapper>
      <ThemeProvider theme={mainTheme}>
        <CssBaseline />
        <AppRoutes />
        <ToastContainer />
      </ThemeProvider>
    </PageWrapper>
  );
}

export default App;
