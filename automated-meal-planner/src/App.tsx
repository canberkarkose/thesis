import React from 'react';
import { CssBaseline } from '@mui/material';
import './App.css';
import { Routes, Route } from 'react-router-dom';

import { LandingPage } from './components/pages/LandingPage/LandingPage';
import { Login } from './components/pages/Login/Login';
import { Register } from './components/pages/Register/Register';

function App() {
  return (
    <>
      <CssBaseline />
      <Routes>
        <Route path='/' element={<LandingPage />} />
        <Route path='/login' element={<Login />} />
        <Route path='/register' element={<Register />} />
      </Routes>
    </>
  );
}

export default App;
