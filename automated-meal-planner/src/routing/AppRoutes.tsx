import { Routes, Route } from 'react-router-dom';

import { LandingPage } from '../components/pages/LandingPage/LandingPage';
import { Login } from '../components/pages/Login/Login';
import { Register } from '../components/pages/Register/Register';
import { Home } from '../components/pages/Home/Home';

import { ProtectedRoute } from './ProtectedRoute';

export const AppRoutes = () => (
  <Routes>
    <Route path='/' element={<LandingPage />} />
    <Route path='/login' element={<Login />} />
    <Route path='/register' element={<Register />} />
    <Route path='/home' element={<ProtectedRoute><Home /></ProtectedRoute>} />
  </Routes>
);
