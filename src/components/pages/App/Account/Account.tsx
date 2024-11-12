/* eslint-disable react/jsx-props-no-spreading */
import { useState, useEffect } from 'react';
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
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';

import { doc, updateDoc } from 'firebase/firestore';

import { toast } from 'react-toastify';

import { Container } from './Account.styles';

import { UserData } from './Account.types';
import { fetchUserData } from './Account.helpers';

import { useAuth } from '@src/contexts/AuthContext';
import { db } from '@src/firebase-config';

import {
  dietOptions,
  intolerancesTypes,
  cuisines,
} from '@components/pages/AccountDetails/Steps/constants';

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

  const handleSaveChanges = async () => {
    try {
      if (user) {
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
        toast.success('Account details updated successfully!', {
          position: 'bottom-left',
        });
        setIsEditingUserInfo(false);
        setIsEditingPreferences(false);
      }
    } catch (error) {
      console.error('Failed to update user details:', error);
      toast.error('Failed to update account details. Please try again.', {
        position: 'bottom-left',
      });
    }
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
        <IconButton onClick={() => setIsEditingUserInfo(!isEditingUserInfo)}>
          <EditIcon />
        </IconButton>
      </Box>
      <Box mt={2}>
        <TextField
          label='Username'
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          disabled={!isEditingUserInfo}
          fullWidth
          margin='normal'
        />
        <TextField
          label='Email'
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={!isEditingUserInfo}
          fullWidth
          margin='normal'
        />
        {/* Add Change Password functionality here */}
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
    </Container>
  );
};
