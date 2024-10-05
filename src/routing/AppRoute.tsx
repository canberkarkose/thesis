import { useEffect, useState } from 'react';
import { useNavigate, Outlet, useLocation } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { toast } from 'react-toastify';
import CircularProgress from '@mui/material/CircularProgress';
import { Box } from '@mui/material';
import 'react-toastify/dist/ReactToastify.css';

import { db } from '../firebase-config';
import { useAuth } from '../contexts/AuthContext';

import { AppLayout } from '@components/templates/AppLayout';

export const AppRoute = () => {
  const { user, loading } = useAuth();
  const [isInitialCheckComplete, setIsInitialCheckComplete] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    window.onpopstate = () => {
      setIsInitialCheckComplete(false);
      window.location.reload();
    };
    if (loading) return;

    if (!user) {
      setTimeout(() => {
        toast.error('Please log in to access this page.', { position: 'bottom-left' });
        navigate('/login');
      }, 1000);
    } else {
      const fetchUserDetails = async () => {
        try {
          const docRef = doc(db, 'users', user.uid);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            const { accountDetailsCompleted } = docSnap.data();
            if (!accountDetailsCompleted && !location.pathname.includes('/account-details')) {
              setTimeout(() => {
                navigate('/app/account-details');
              }, 1000);
            } else if (accountDetailsCompleted && location.pathname.includes('/account-details')) {
              setTimeout(() => {
                navigate('/app/dashboard');
                toast.info('Your account details are already configured. Visit profile settings to make changes.', { position: 'bottom-left' });
              }, 1000);
            } else {
              setIsInitialCheckComplete(true);
            }
          } else {
            console.error('No such document!');
            setIsInitialCheckComplete(true);
          }
        } catch (error) {
          console.error('Error fetching user details:', error);
          setIsInitialCheckComplete(true);
        }
      };
      fetchUserDetails();
    }
  }, [user, loading, location.pathname, navigate]);

  if (loading || !isInitialCheckComplete) {
    return (
      <Box
        display='flex'
        justifyContent='center'
        alignItems='center'
        minHeight='100vh'
      >
        <CircularProgress />
      </Box>
    );
  }

  const routesWithoutLayout = ['/app/account-details'];
  const shouldShowLayout = !routesWithoutLayout.includes(location.pathname);

  if (shouldShowLayout) {
    return (
      <AppLayout>
        <Outlet />
      </AppLayout>
    );
  }
  return <Outlet />;
};
