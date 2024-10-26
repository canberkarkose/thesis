import { CssBaseline, ThemeProvider } from '@mui/material';

import { ToastContainer } from 'react-toastify';

import { AppRoutes } from './routing/AppRoutes.tsx';

import { mainTheme } from './themes/mainTheme.ts';
import { PageWrapper } from './App.styles.ts';
import { AuthProvider } from './contexts/AuthContext.tsx';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  return (
    <PageWrapper>
      <ThemeProvider theme={mainTheme}>
        <CssBaseline />
        <AuthProvider>
          <AppRoutes />
          <ToastContainer />
        </AuthProvider>
      </ThemeProvider>
    </PageWrapper>
  );
}

export default App;
