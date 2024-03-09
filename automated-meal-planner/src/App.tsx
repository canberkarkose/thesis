import { CssBaseline, ThemeProvider } from '@mui/material';
import './App.styles.ts';
import { Routes, Route } from 'react-router-dom';

import { LandingPage } from './components/pages/LandingPage/LandingPage';
import { Login } from './components/pages/Login/Login';
import { Register } from './components/pages/Register/Register';

import { mainTheme } from './themes/mainTheme.ts';

function App() {
  return (
    <ThemeProvider theme={mainTheme}>
      <CssBaseline />
      <Routes>
        <Route path='/' element={<LandingPage />} />
        <Route path='/login' element={<Login />} />
        <Route path='/register' element={<Register />} />
      </Routes>
    </ThemeProvider>
  );
}

export default App;
