import { Routes, Route } from 'react-router-dom';

import { LandingPage } from '../components/pages/LandingPage/LandingPage';
import { Login } from '../components/pages/Login/Login';
import { Register } from '../components/pages/Register/Register';
import { Dashboard } from '../components/pages/App/Dashboard/Dashboard';

import { AccountDetails } from '../components/pages/AccountDetails/AccountDetails';

import { ResetPassword } from '../components/pages/Login/ForgotPassword/ResetPassword';

import { RequestReset } from '../components/pages/Login/ForgotPassword/RequestReset';

import { AppRoute } from './AppRoute';

import { GroceryList } from '@components/pages/App/GroceryList/GroceryList';
import { MealPlanner } from '@components/pages/App/MealPlanner/MealPlanner';
import { Recipes } from '@components/pages/App/Recipes/Recipes';

export const AppRoutes = () => (
  <Routes>
    <Route path='/' element={<LandingPage />} />
    <Route path='/login' element={<Login />} />
    <Route path='/register' element={<Register />} />
    <Route path='/forgot-password' element={<RequestReset />} />
    <Route path='/reset-password' element={<ResetPassword />} />
    <Route path='/app' element={<AppRoute />}>
      <Route path='account-details' element={<AccountDetails />} />
      <Route path='dashboard' element={<Dashboard />} />
      <Route path='grocery-list' element={<GroceryList />} />
      <Route path='meal-planner' element={<MealPlanner />} />
      <Route path='recipes' element={<Recipes />} />
    </Route>
  </Routes>
);
