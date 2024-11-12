/* eslint-disable react/jsx-props-no-spreading */
import { useState, useEffect, useMemo } from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  CircularProgress,
  IconButton,
  Divider,
  Autocomplete,
  Checkbox,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  InputAdornment
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';

import { updateEmail, reauthenticateWithCredential, EmailAuthProvider } from 'firebase/auth';

import { doc, updateDoc } from 'firebase/firestore';

import { toast } from 'react-toastify';

import { Container } from './Account.styles';

import { UserData } from './Account.types';
import {
  fetchUserData,
  validateUsername,
  hasUnsavedChanges,
  validateEmail,
  checkEmailAvailability,
} from './Account.helpers';

import { useAuth } from '@src/contexts/AuthContext';
import { db } from '@src/firebase-config';

import {
  dietOptions,
  intolerancesTypes,
  cuisines,
} from '@components/pages/AccountDetails/Steps/constants';
import { checkUsernameAvailabilityHttp } from '@src/services/auth-service';

export const Account = () => {
  const { user, loading } = useAuth();
  const [userData, setUserData] = useState<UserData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const [isEditingUserInfo, setIsEditingUserInfo] = useState(false);
  const [isEditingPreferences, setIsEditingPreferences] = useState(false);

  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');

  const [diet, setDiet] = useState('');
  const [intolerances, setIntolerances] = useState<string[]>([]);
  const [includedCuisines, setIncludedCuisines] = useState<string[]>([]);
  const [excludedCuisines, setExcludedCuisines] = useState<string[]>([]);

  const [usernameError, setUsernameError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [password, setPassword] = useState('');
  const [isReauthRequired, setIsReauthRequired] = useState(false);
  const [passwordError, setPasswordError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const hasChanges = useMemo(() => hasUnsavedChanges(
    userData,
    username,
    email,
    diet,
    intolerances,
    includedCuisines,
    excludedCuisines
  ), [userData, username, email, diet, intolerances, includedCuisines, excludedCuisines]);

  useEffect(() => {
    const getUserData = async () => {
      const data = await fetchUserData(user);
      setUserData(data);
      setIsLoading(false);
    };

    getUserData();
  }, [user]);

  useEffect(() => {
    if (userData) {
      setUsername(userData.username || '');
      setEmail(userData.email || '');
      if (userData.accountDetails) {
        setDiet(userData.accountDetails.diet || '');
        setIntolerances(userData.accountDetails.intolerances || []);
        setIncludedCuisines(
          userData.accountDetails.cuisinePreferences?.includedCuisines || []
        );
        setExcludedCuisines(
          userData.accountDetails.cuisinePreferences?.excludedCuisines || []
        );
      }
    }
  }, [userData]);

  const updateFirestoreUser = async () => {
    if (!user) return;
    const docRef = doc(db, 'users', user.uid);
    await updateDoc(docRef, {
      username,
      email,
      accountDetails: {
        diet,
        intolerances,
        cuisinePreferences: {
          includedCuisines,
          excludedCuisines,
        },
      },
    });

    setUserData((prevUserData) => ({
      ...prevUserData!,
      username,
      email,
      accountDetails: {
        ...prevUserData?.accountDetails,
        diet,
        intolerances,
        cuisinePreferences: {
          includedCuisines,
          excludedCuisines,
        },
      },
    }));
  };

  const handleSaveChanges = async () => {
    try {
      if (user) {
        let shouldReauth = false;
        // Handle Username Changes
        if (username !== userData?.username) {
          const isUsernameAvailable = await checkUsernameAvailabilityHttp(username);
          if (!isUsernameAvailable) {
            setUsernameError('Username is already taken');
            return; // Stop further execution
          }
        }
        // Handle Email Changes
        if (email !== userData?.email) {
          // Validate email
          const emailValidationError = validateEmail(email);
          if (emailValidationError) {
            setEmailError(emailValidationError);
            return;
          }
          // Check email availability
          const isEmailAvailable = await checkEmailAvailability(email, user.uid);
          if (!isEmailAvailable) {
            setEmailError('Email is already in use.');
            return;
          }
          // Flag to trigger re-authentication
          shouldReauth = true;
        }
        if (shouldReauth) {
          // Open re-authentication dialog
          setIsReauthRequired(true);
          return; // Wait for re-authentication
        }
        // If no email change, proceed to update Firestore
        await updateFirestoreUser();
        // Show success message
        toast.success('Account details updated successfully!', {
          position: 'bottom-left',
        });
        // Exit edit modes
        setIsEditingUserInfo(false);
        setIsEditingPreferences(false);
        setUsernameError('');
        setEmailError('');
      }
    } catch (error) {
      console.error('Failed to update user details:', error);
      toast.error('Failed to update account details. Please try again.', {
        position: 'bottom-left',
      });
    }
  };

  const handleReauthenticate = async () => {
    try {
      if (!user || !userData) return;
      // Create credentials with the user's current email and entered password
      const credential = EmailAuthProvider.credential(userData.email, password);
      // Re-authenticate the user
      await reauthenticateWithCredential(user, credential);
      // Update email in Firebase Auth
      await updateEmail(user, email);
      // Update Firestore
      await updateFirestoreUser();
      // Reset states and close dialog
      setIsEditingUserInfo(false);
      setIsEditingPreferences(false);
      setIsReauthRequired(false);
      setPassword('');
      setUsernameError('');
      setEmailError('');
      // Show success message
      toast.success('Account details updated successfully!', {
        position: 'bottom-left',
      });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.error('Re-authentication failed:', error);
      if (error.code === 'auth/wrong-password') {
        setPasswordError('Incorrect password. Please try again.');
      } else if (error.code === 'auth/too-many-requests') {
        setPasswordError('Too many requests. Please try again later.');
      } else {
        toast.error('Failed to re-authenticate. Please try again later.', { position: 'bottom-left' });
      }
    }
  };

  const handleClickShowPassword = () => {
    setShowPassword((prev) => !prev);
  };

  const handleDiscardChanges = () => {
    setUsername(userData?.username || '');
    setEmail(userData?.email || '');
    if (userData?.accountDetails) {
      setDiet(userData.accountDetails.diet || '');
      setIntolerances(userData.accountDetails.intolerances || []);
      setIncludedCuisines(
        userData.accountDetails.cuisinePreferences?.includedCuisines || []
      );
      setExcludedCuisines(
        userData.accountDetails.cuisinePreferences?.excludedCuisines || []
      );
    }
    setIsEditingUserInfo(false);
    setIsEditingPreferences(false);
    setUsernameError('');
    setEmailError('');
    setPassword('');
    setPasswordError('');
    setIsReauthRequired(false);
    toast.info('Changes discarded.', { position: 'bottom-left' });
  };

  if (loading || isLoading) {
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

  return (
    <Container>
      <Typography variant='h4'>Account Details</Typography>
      <Divider sx={{ my: 2 }} />
      <Box display='flex' justifyContent='space-between' alignItems='center'>
        <Typography variant='h6'>User Information</Typography>
        <IconButton
          onClick={() => {
            setIsEditingUserInfo(!isEditingUserInfo);
            if (!isEditingUserInfo) {
              // Entering edit mode, validate the current username and email
              const usernameErr = validateUsername(username);
              setUsernameError(usernameErr);
              const emailErr = validateEmail(email);
              setEmailError(emailErr);
            } else {
              // Exiting edit mode, clear validation errors
              setUsernameError('');
              setEmailError('');
            }
          }}
        >
          <EditIcon />
        </IconButton>
      </Box>
      <Box mt={2}>
        <TextField
          label='Username'
          value={username}
          onChange={(e) => {
            const newValue = e.target.value;
            setUsername(newValue);
            if (isEditingUserInfo) {
              const error = validateUsername(newValue);
              setUsernameError(error);
            }
          }}
          disabled={!isEditingUserInfo}
          fullWidth
          margin='normal'
          error={Boolean(usernameError)}
          helperText={usernameError}
        />
        <TextField
          label='Email'
          value={email}
          onChange={(e) => {
            const newValue = e.target.value;
            setEmail(newValue);
            if (isEditingUserInfo) {
              const error = validateEmail(newValue);
              setEmailError(error);
            }
          }}
          disabled={!isEditingUserInfo}
          fullWidth
          margin='normal'
          error={Boolean(emailError)}
          helperText={emailError}
        />
      </Box>
      <Divider sx={{ my: 2 }} />
      <Box display='flex' justifyContent='space-between' alignItems='center'>
        <Typography variant='h6'>Account Preferences</Typography>
        <IconButton onClick={() => setIsEditingPreferences(!isEditingPreferences)}>
          <EditIcon />
        </IconButton>
      </Box>
      <Box mt={2}>
        <TextField
          label='Diet'
          value={diet}
          onChange={(e) => setDiet(e.target.value)}
          disabled={!isEditingPreferences}
          select
          fullWidth
          margin='normal'
          SelectProps={{ native: true }}
        >
          {dietOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </TextField>
        <Autocomplete
          multiple
          options={intolerancesTypes}
          value={intolerances}
          onChange={(_event, newValue) => setIntolerances(newValue)}
          disabled={!isEditingPreferences}
          disableCloseOnSelect
          renderOption={(props, option, { selected }) => (
            <li {...props}>
              <Checkbox style={{ marginRight: 8 }} checked={selected} />
              {option}
            </li>
          )}
          renderInput={(params) => (
            <TextField {...params} label='Intolerances' margin='normal' />
          )}
        />
        <Autocomplete
          multiple
          options={cuisines}
          value={includedCuisines}
          onChange={(_event, newValue) => setIncludedCuisines(newValue)}
          disabled={!isEditingPreferences}
          disableCloseOnSelect
          renderOption={(props, option, { selected }) => (
            <li {...props}>
              <Checkbox style={{ marginRight: 8 }} checked={selected} />
              {option}
            </li>
          )}
          renderInput={(params) => (
            <TextField {...params} label='Included Cuisines' margin='normal' />
          )}
        />
        <Autocomplete
          multiple
          options={cuisines}
          value={excludedCuisines}
          onChange={(_event, newValue) => setExcludedCuisines(newValue)}
          disabled={!isEditingPreferences}
          disableCloseOnSelect
          renderOption={(props, option, { selected }) => (
            <li {...props}>
              <Checkbox style={{ marginRight: 8 }} checked={selected} />
              {option}
            </li>
          )}
          renderInput={(params) => (
            <TextField {...params} label='Excluded Cuisines' margin='normal' />
          )}
        />
      </Box>
      {(isEditingUserInfo || isEditingPreferences) && (
        <Box display='flex' justifyContent='center' gap={2} sx={{ mt: 2 }}>
          <Button
            variant='contained'
            sx={{
              bgcolor: '#5b9d3e',
              '&:hover': {
                bgcolor: 'success.dark',
              },
            }}
            startIcon={<SaveIcon />}
            onClick={handleSaveChanges}
            disabled={Boolean(usernameError) || Boolean(emailError) || !hasChanges}
          >
            Save Changes
          </Button>
          <Button
            variant='outlined'
            color='secondary'
            sx={{
              '&:hover': {
                bgcolor: '#cecececa',
              },
            }}
            onClick={handleDiscardChanges}
          >
            Discard Changes
          </Button>
        </Box>
      )}
      {isReauthRequired && (
        <Dialog open={isReauthRequired} onClose={() => setIsReauthRequired(false)}>
          <DialogTitle>Confirm Your Password</DialogTitle>
          <DialogContent>
            <Typography variant='body1'>
              Please enter your password to confirm the changes.
            </Typography>
            <TextField
              label='Password'
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              fullWidth
              margin='normal'
              error={Boolean(passwordError)}
              helperText={passwordError || ' '}
              InputProps={{
                endAdornment: (
                  <InputAdornment position='end'>
                    <IconButton
                      aria-label={showPassword ? 'Hide password' : 'Show password'}
                      onClick={handleClickShowPassword}
                      edge='end'
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
          </DialogContent>
          <DialogActions>
            <Button
              onClick={() => {
                setIsReauthRequired(false);
                setPassword('');
                setPasswordError('');
              }}
              color='secondary'
              variant='outlined'
              sx={{
                '&:hover': {
                  bgcolor: '#cecececa',
                },
              }}
            >
              Cancel
            </Button>
            <Button
              onClick={handleReauthenticate}
              color='primary'
              variant='contained'
              disabled={!password}
            >
              Confirm
            </Button>
          </DialogActions>
        </Dialog>
      )}
    </Container>
  );
};
