import { CssBaseline, ThemeProvider } from '@mui/material';
import { Routes, Route } from 'react-router-dom';

import { LandingPage } from './components/pages/LandingPage/LandingPage';
import { Login } from './components/pages/Login/Login';
import { Register } from './components/pages/Register/Register';
import { Home } from './components/pages/Home/Home.tsx';

import { mainTheme } from './themes/mainTheme.ts';
import { PageWrapper } from './App.styles.ts';

function App() {
  return (
    <PageWrapper>
      <ThemeProvider theme={mainTheme}>
        <CssBaseline />
        <Routes>
          <Route path='/' element={<LandingPage />} />
          <Route path='/login' element={<Login />} />
          <Route path='/register' element={<Register />} />
          <Route path='/home' element={<Home />} />
        </Routes>
      </ThemeProvider>
    </PageWrapper>
  );
}

export default App;
