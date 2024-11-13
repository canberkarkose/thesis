import { Routes, Route } from 'react-router-dom';

import { LandingPage } from '../components/pages/LandingPage/LandingPage';
import { Login } from '../components/pages/Login/Login';
import { Register } from '../components/pages/Register/Register';
import { Dashboard } from '../components/pages/App/Dashboard/Dashboard';
import { AccountDetails } from '../components/pages/AccountDetails/AccountDetails';
import { ResetPassword } from '../components/pages/Login/ForgotPassword/ResetPassword';
import { RequestReset } from '../components/pages/Login/ForgotPassword/RequestReset';
import { ErrorPage } from '../components/pages/ErrorPage/ErrorPage';

import { ProtectedRoute } from './ProtectedRoute';

import { AppLayout } from '@components/templates/AppLayout/AppLayout';

import { GroceryList } from '@components/pages/App/GroceryList/GroceryList';
import { MealPlanner } from '@components/pages/App/MealPlanner/MealPlanner';
import { Recipes } from '@components/pages/App/Recipes/Recipes';
import { HowItWorks } from '@components/pages/HowItWorks/HowItworks';
import { Account } from '@components/pages/App/Account/Account';

export const AppRoutes = () => (
  <Routes>
    {/* Public Routes */}
    <Route path='/' element={<LandingPage />} />
    <Route path='/how-it-works' element={<HowItWorks />} />
    <Route path='/login' element={<Login />} />
    <Route path='/register' element={<Register />} />
    <Route path='/forgot-password' element={<RequestReset />} />
    <Route path='/reset-password' element={<ResetPassword />} />
    {/* Protected Routes */}
    <Route element={<ProtectedRoute />}>
      {/* Routes without layout */}
      <Route path='/app/account-details' element={<AccountDetails />} />
      {/* Routes with layout */}
      <Route path='/app' element={<AppLayout />}>
        <Route path='dashboard' element={<Dashboard />} />
        <Route path='grocery-list' element={<GroceryList />} />
        <Route path='meal-planner' element={<MealPlanner />} />
        <Route path='recipes' element={<Recipes />} />
        <Route path='account' element={<Account />} />
        <Route
          path='*'
          element={<ErrorPage isAuthenticated />}
        />
      </Route>
    </Route>
    <Route
      path='*'
      element={<ErrorPage isAuthenticated={false} />}
    />
  </Routes>
);
