import { Routes, Route } from 'react-router-dom';

import { LandingPage } from '../components/pages/LandingPage/LandingPage';
import { Login } from '../components/pages/Login/Login';
import { Register } from '../components/pages/Register/Register';
import { Home } from '../components/pages/Home/Home';

import { AccountDetails } from '../components/pages/AccountDetails/AccountDetails';

import { ResetPassword } from '../components/pages/Login/ForgotPassword/ResetPassword';

import { RequestReset } from '../components/pages/Login/ForgotPassword/RequestReset';

import { AppRoute } from './AppRoute';

export const AppRoutes = () => (
  <Routes>
    <Route path='/' element={<LandingPage />} />
    <Route path='/login' element={<Login />} />
    <Route path='/register' element={<Register />} />
    <Route path='/forgot-password' element={<RequestReset />} />
    <Route path='/reset-password' element={<ResetPassword />} />
    <Route path='/app' element={<AppRoute />}>
      <Route path='account-details' element={<AccountDetails />} />
      <Route path='home' element={<Home />} />
    </Route>
  </Routes>
);
