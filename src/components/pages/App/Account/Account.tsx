/* eslint-disable @typescript-eslint/no-explicit-any */
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

import { useNavigate } from 'react-router-dom';

import {
  updateEmail, reauthenticateWithCredential, EmailAuthProvider, updatePassword
} from 'firebase/auth';

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
  deleteUserData, reauthenticateUser, deleteFirebaseAuthUser
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
  const [isPasswordChangeDialogOpen, setIsPasswordChangeDialogOpen] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [currentShowPassword, setCurrentShowPassword] = useState(false);
  const [newShowPassword, setNewShowPassword] = useState(false);
  const [confirmShowPassword, setConfirmShowPassword] = useState(false);
  const [currentPasswordError, setCurrentPasswordError] = useState('');
  const [newPasswordError, setNewPasswordError] = useState('');
  const [confirmNewPasswordError, setConfirmNewPasswordError] = useState('');

  // Inside the Account component

  // Delete Account Dialog States
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [deletePassword, setDeletePassword] = useState('');
  const [deletePasswordError, setDeletePasswordError] = useState('');
  const [showDeletePassword, setShowDeletePassword] = useState(false);

  // Initialize navigation
  const navigate = useNavigate();

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

  const handleDeleteAccount = async () => {
    if (!user) return;

    try {
      // Re-authenticate the user
      await reauthenticateUser(user, deletePassword);

      // Delete user data from Firestore
      await deleteUserData(user.uid);

      // Delete the user from Firebase Auth
      await deleteFirebaseAuthUser(user);

      // Reset state and close dialog
      setIsDeleteDialogOpen(false);
      setDeletePassword('');
      setDeletePasswordError('');
      setShowDeletePassword(false);

      // Redirect to /register
      navigate('/register');

      // Show success toast
      toast.success('Account deleted successfully.', { position: 'bottom-left' });
    } catch (error: any) {
      console.error('Account deletion failed:', error);
      if (error.code === 'auth/wrong-password') {
        setDeletePasswordError('Incorrect password. Please try again.');
      } else {
        toast.error('Failed to delete account. Please try again later.', { position: 'bottom-left' });
      }
    }
  };

  const validatePassword = (pwd: string) => ({
    letter: /[a-zA-Z]/.test(pwd),
    numberOrSpecialChar: /[\d!@#$%^&*]/.test(pwd),
    length: pwd.length >= 7,
  });

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

  const handleChangePassword = async () => {
    // Reset previous errors
    setCurrentPasswordError('');
    setNewPasswordError('');
    setConfirmNewPasswordError('');

    // Destructure password validation
    const { letter, numberOrSpecialChar, length } = validatePassword(newPassword);
    let isValid = true;

    // Validate Current Password
    if (!currentPassword) {
      setCurrentPasswordError('Current password is required.');
      isValid = false;
    }

    // Validate New Password
    if (!newPassword) {
      setNewPasswordError('New password is required.');
      isValid = false;
    } else {
      if (newPassword === currentPassword) {
        setNewPasswordError('New password must be different from the current password.');
        isValid = false;
      }
      if (!letter) {
        setNewPasswordError('Password must contain at least one letter.');
        isValid = false;
      }
      if (!numberOrSpecialChar) {
        setNewPasswordError('Password must contain at least one number or special character (!@#$%^&*).');
        isValid = false;
      }
      if (!length) {
        setNewPasswordError('Password must be at least 7 characters long.');
        isValid = false;
      }
    }

    // Validate Confirm New Password
    if (!confirmNewPassword) {
      setConfirmNewPasswordError('Please confirm your new password.');
      isValid = false;
    } else if (newPassword !== confirmNewPassword) {
      setConfirmNewPasswordError('Passwords do not match.');
      isValid = false;
    }

    if (!isValid) return;

    try {
      if (!user || !userData) return;

      // Create credentials with the user's current email and entered current password
      const credential = EmailAuthProvider.credential(userData.email, currentPassword);

      // Re-authenticate the user
      await reauthenticateWithCredential(user, credential);

      // Update the password in Firebase Auth
      await updatePassword(user, newPassword);

      // Optionally, you can notify the user to re-login or inform them of the successful change
      toast.success('Password changed successfully!', { position: 'bottom-left' });

      // Reset and close the dialog
      setIsPasswordChangeDialogOpen(false);
      setCurrentPassword('');
      setNewPassword('');
      setConfirmNewPassword('');
      setNewPasswordError('');
      setConfirmNewPasswordError('');
    } catch (error: any) {
      console.error('Password change failed:', error);
      if (error.code === 'auth/wrong-password') {
        setCurrentPasswordError('Incorrect current password.');
      } else if (error.code === 'auth/weak-password') {
        setNewPasswordError('Password is too weak.');
      } else {
        toast.error('Failed to change password. Please try again later.', { position: 'bottom-left' });
      }
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
    <>
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
          <Typography variant='body1' gutterBottom sx={{ mt: 2, mb: 2 }}>
            To change your password, click the button below.
          </Typography>
          <Button
            variant='contained'
            sx={{
              bgcolor: '#5b9d3e',
              '&:hover': {
                bgcolor: 'success.dark',
              },
              mb: 2
            }}
            onClick={() => {
              setIsPasswordChangeDialogOpen(true);
              setCurrentShowPassword(false);
              setNewShowPassword(false);
              setConfirmShowPassword(false);
            }}
            disabled={!isEditingUserInfo}
          >
            Change Password
          </Button>
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
        <Dialog
          open={isPasswordChangeDialogOpen}
          onClose={() => {
            setIsPasswordChangeDialogOpen(false);
            // Reset all password fields and errors
            setCurrentPassword('');
            setNewPassword('');
            setConfirmNewPassword('');
            setCurrentPasswordError('');
            setNewPasswordError('');
            setConfirmNewPasswordError('');
            setCurrentShowPassword(false);
            setNewShowPassword(false);
            setConfirmShowPassword(false);
          }}
        >
          <DialogTitle>Change Password</DialogTitle>
          <DialogContent>
            <Typography variant='body1' gutterBottom>
              To change your password,
              please enter your current password and then your new password.
            </Typography>
            <TextField
              label='Current Password'
              type={currentShowPassword ? 'text' : 'password'}
              value={currentPassword}
              onChange={(e) => {
                setCurrentPassword(e.target.value);
                if (currentPasswordError && e.target.value) {
                  setCurrentPasswordError('');
                }
              }}
              fullWidth
              margin='normal'
              error={Boolean(currentPasswordError)}
              helperText={currentPasswordError || ' '}
              InputProps={{
                endAdornment: (
                  <InputAdornment position='end'>
                    <IconButton
                      aria-label={currentShowPassword ? 'Hide password' : 'Show password'}
                      onClick={() => setCurrentShowPassword(!currentShowPassword)}
                      edge='end'
                    >
                      {currentShowPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
            <TextField
              label='New Password'
              type={newShowPassword ? 'text' : 'password'}
              value={newPassword}
              onChange={(e) => {
                const { value } = e.target;
                setNewPassword(value);
                const validation = validatePassword(value);
                // Check if new password matches current password
                if (value && value === currentPassword) {
                  setNewPasswordError('New password must be different from the current password.');
                } else if (!validation.letter
                || !validation.numberOrSpecialChar
                || !validation.length) {
                  setNewPasswordError('Password must be at least 7 characters long and include at least one letter and one number or special character (!@#$%^&*).');
                } else {
                  setNewPasswordError('');
                }
                // Validate confirm password if it's already filled
                if (confirmNewPassword && value !== confirmNewPassword) {
                  setConfirmNewPasswordError('Passwords do not match.');
                } else {
                  setConfirmNewPasswordError('');
                }
              }}
              fullWidth
              margin='normal'
              error={Boolean(newPasswordError)}
              helperText={newPasswordError || ' '}
              InputProps={{
                endAdornment: (
                  <InputAdornment position='end'>
                    <IconButton
                      aria-label={newShowPassword ? 'Hide password' : 'Show password'}
                      onClick={() => setNewShowPassword(!newShowPassword)}
                      edge='end'
                    >
                      {newShowPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
            <TextField
              label='Confirm New Password'
              type={confirmShowPassword ? 'text' : 'password'}
              value={confirmNewPassword}
              onChange={(e) => {
                const { value } = e.target;
                setConfirmNewPassword(value);
                if (newPassword !== value) {
                  setConfirmNewPasswordError('Passwords do not match.');
                } else {
                  setConfirmNewPasswordError('');
                }
              }}
              fullWidth
              margin='normal'
              error={Boolean(confirmNewPasswordError)}
              helperText={confirmNewPasswordError || ' '}
              InputProps={{
                endAdornment: (
                  <InputAdornment position='end'>
                    <IconButton
                      aria-label={confirmShowPassword ? 'Hide password' : 'Show password'}
                      onClick={() => setConfirmShowPassword(!confirmShowPassword)}
                      edge='end'
                    >
                      {confirmShowPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
          </DialogContent>
          <DialogActions>
            <Button
              onClick={() => {
                setIsPasswordChangeDialogOpen(false);
                // Reset all password fields and errors
                setCurrentPassword('');
                setNewPassword('');
                setConfirmNewPassword('');
                setCurrentPasswordError('');
                setNewPasswordError('');
                setConfirmNewPasswordError('');
                setCurrentShowPassword(false);
                setNewShowPassword(false);
                setConfirmShowPassword(false);
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
              onClick={handleChangePassword}
              color='primary'
              variant='contained'
              disabled={!currentPassword
              || !newPassword
              || !confirmNewPassword
              || Boolean(currentPasswordError)
              || Boolean(newPasswordError)
              || Boolean(confirmNewPasswordError)}
            >
              Change Password
            </Button>
          </DialogActions>
        </Dialog>
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
        <Dialog
          open={isDeleteDialogOpen}
          onClose={() => {
            setIsDeleteDialogOpen(false);
            setDeletePassword('');
            setDeletePasswordError('');
            setShowDeletePassword(false);
          }}
        >
          <DialogTitle>Delete Account</DialogTitle>
          <DialogContent>
            <Typography variant='body1' gutterBottom>
              Please enter your password to confirm the deletion of your account.
              This action is irreversible.
            </Typography>
            <TextField
              label='Password'
              type={showDeletePassword ? 'text' : 'password'}
              value={deletePassword}
              onChange={(e) => {
                const { value } = e.target;
                setDeletePassword(value);
                if (deletePasswordError && value) {
                  setDeletePasswordError('');
                }
              }}
              fullWidth
              margin='normal'
              error={Boolean(deletePasswordError)}
              helperText={deletePasswordError || ' '}
              InputProps={{
                endAdornment: (
                  <InputAdornment position='end'>
                    <IconButton
                      aria-label={showDeletePassword ? 'Hide password' : 'Show password'}
                      onClick={() => setShowDeletePassword(!showDeletePassword)}
                      edge='end'
                    >
                      {showDeletePassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
          </DialogContent>
          <DialogActions>
            <Button
              onClick={() => {
                setIsDeleteDialogOpen(false);
                setDeletePassword('');
                setDeletePasswordError('');
                setShowDeletePassword(false);
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
              onClick={handleDeleteAccount}
              color='error'
              variant='contained'
              disabled={!deletePassword}
            >
              Delete
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
      <Box mt={3} display='flex' justifyContent='center'>
        <Button
          variant='contained'
          color='error'
          onClick={() => setIsDeleteDialogOpen(true)}
          disabled={isEditingUserInfo || isEditingPreferences}
        >
          Delete Account
        </Button>
      </Box>
    </>
  );
};
