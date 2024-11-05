import { useEffect, useState } from 'react';
import {
  Outlet, useLocation, useNavigate
} from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { toast } from 'react-toastify';
import CircularProgress from '@mui/material/CircularProgress';
import { Box } from '@mui/material';

import { db } from '../firebase-config';
import { useAuth } from '../contexts/AuthContext';

import { usePrevious } from '@src/hooks/usePrevious';

export const ProtectedRoute = () => {
  const { user, loading } = useAuth();
  const [isInitialCheckComplete, setIsInitialCheckComplete] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const previousUser = usePrevious(user);

  useEffect(() => {
    if (loading) return;

    if (!user) {
      // Check if the user has just logged out
      if (previousUser && !user) {
        toast.info('You have been logged out.', { position: 'bottom-left' });
      } else {
        toast.error('Please log in to access this page.', { position: 'bottom-left' });
      }
      navigate('/login');
    } else {
      const fetchUserDetails = async () => {
        try {
          const docRef = doc(db, 'users', user.uid);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            const { accountDetailsCompleted } = docSnap.data();

            // Only handle navigation and toasts if the page is accessed directly
            if (!accountDetailsCompleted && !location.pathname.includes('/app/account-details')) {
              navigate('/app/account-details');
            } else if (
              accountDetailsCompleted
              && location.pathname.includes('/app/account-details')
            ) {
              navigate('/app/dashboard');
              toast.info(
                'Your account details are already configured. Visit account settings to make changes.',
                { position: 'bottom-left' }
              );
            }

            setIsInitialCheckComplete(true);
          } else {
            console.error('No such document!');
            setIsInitialCheckComplete(true);
          }
        } catch (error) {
          console.error('Error fetching user details:', error);
          setIsInitialCheckComplete(true);
        }
      };

      // Fetch user details only if this is an initial check (e.g., page refresh)
      if (!isInitialCheckComplete) {
        fetchUserDetails();
      } else {
        setIsInitialCheckComplete(true);
      }
    }
  }, [user, loading, location.pathname]);

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

  return <Outlet />;
};
