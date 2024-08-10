import {
  Box,
  CircularProgress,
  Step,
  StepLabel,
  Stepper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  IconButton,
  Menu,
  MenuItem,
} from '@mui/material';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { toast } from 'react-toastify';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { doc, updateDoc } from 'firebase/firestore';

import { db } from '../../../firebase-config';
import { useAuth } from '../../../contexts/AuthContext';

import {
  AccountDetailsContainer, ContentContainer, MenuContainer, StyledButton
} from './AccountDetails.styles';
import { AccountDetailsStepOne } from './Steps/AccountDetailsStepOne';
import { AccountDetailsStepTwo } from './Steps/AccountDetailsStepTwo';
import { AccountDetailsStepThree } from './Steps/AccountDetailsStepThree';
import { FinalReviewStep } from './Steps/FinalReviewStep';
import { CuisinePreferences } from './Steps/types/Step.types';

export const AccountDetails = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [openModal, setOpenModal] = useState(true);
  const [diet, setDiet] = useState<string>('anything');
  const [intolerances, setIntolerances] = useState<string[]>([]);
  const [cuisinePreferences, setCuisinePreferences] = useState<CuisinePreferences>({
    includedCuisines: [],
    excludedCuisines: []
  });
  const navigate = useNavigate();
  const steps = ['', '', ''];
  const { user, loading } = useAuth();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    handleClose();
  };

  const updateCuisines = (cuisineDetails: CuisinePreferences): void => {
    setCuisinePreferences(cuisineDetails);
  };

  const handleNext = () => {
    if (activeStep < steps.length) {
      setActiveStep((prevActiveStep) => prevActiveStep + 1);
    }
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleSubmit = async () => {
    if (!user) {
      toast.error('User not found. Please log in again.', { position: 'bottom-left' });
      setTimeout(() => {
        navigate('/login');
      }, 1000);
      return;
    }

    const userDetails = {
      accountDetails: {
        diet,
        intolerances,
        cuisinePreferences,
      },
      accountDetailsCompleted: true,
    };

    try {
      setIsSubmitting(true);
      await updateDoc(doc(db, 'users', user.uid), userDetails);
      setTimeout(() => {
        setIsSubmitting(false);
        toast.success('Account details updated successfully!', { position: 'bottom-left' });
        navigate('/app/home');
      }, 1000);
    } catch (error) {
      console.error('Failed to update user details:', error);
    }
  };

  if (loading || isSubmitting) {
    return (
      <Box display='flex' justifyContent='center' alignItems='center' minHeight='100vh'>
        <CircularProgress />
      </Box>
    );
  }

  const renderStepContent = (step: number) => {
    switch (step) {
      case 0:
        return (
          <AccountDetailsStepOne
            handleNext={handleNext}
            updateDietDetails={setDiet}
            userDiet={diet}
          />
        );
      case 1:
        return (
          <AccountDetailsStepTwo
            handleNext={handleNext}
            handleBack={handleBack}
            updateIntolerances={setIntolerances}
            intolerances={intolerances}
          />
        );
      case 2:
        return (
          <AccountDetailsStepThree
            handleNext={handleNext}
            handleBack={handleBack}
            updateCuisines={updateCuisines}
            cuisinePreferences={cuisinePreferences}
          />
        );
      case 3:
        return (
          <FinalReviewStep
            handleBack={handleBack}
            handleSubmit={handleSubmit}
            data={{ diet, intolerances, cuisinePreferences }}
          />
        );
      default:
        return 'Unknown step';
    }
  };

  return (
    <AccountDetailsContainer>
      <Dialog
        open={openModal}
        onClose={() => setOpenModal(false)}
        aria-labelledby='alert-dialog-title'
        aria-describedby='alert-dialog-description'
        PaperProps={{
          style: {
            backgroundColor: '#415247',
            color: 'white',
          },
        }}
      >
        <DialogTitle
          id='alert-dialog-title'
          style={{
            fontWeight: 600,
            letterSpacing: '0.5px',
            lineHeight: '1.4',
            textShadow: '1px 1px 2px rgba(0,0,0,0.1)',
          }}
          color='white'
        >
          Account Created
        </DialogTitle>
        <DialogContent>
          <DialogContentText id='alert-dialog-description' sx={{ color: 'white' }}>
            Your account has been created!
            To be able to use the app and access customized recipes, we just need a few more
            details.
            You can update these details at any time from your profile later.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <StyledButton onClick={() => setOpenModal(false)}>
            Let&apos;s Begin
          </StyledButton>
        </DialogActions>
      </Dialog>
      <ContentContainer>
        <MenuContainer>
          <IconButton
            size='large'
            aria-label='account of current user'
            aria-controls='menu-appbar'
            aria-haspopup='true'
            onClick={handleMenu}
            color='inherit'
          >
            <AccountCircleIcon style={{ fontSize: '40px' }} />
          </IconButton>
          <Menu
            id='menu-appbar'
            anchorEl={anchorEl}
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'right',
            }}
            keepMounted
            transformOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
            open={Boolean(anchorEl)}
            onClose={handleClose}
          >
            <MenuItem onClick={handleLogout}>Logout</MenuItem>
          </Menu>
        </MenuContainer>
        <Stepper activeStep={activeStep} alternativeLabel sx={{ mb: 2 }}>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>
        {renderStepContent(activeStep)}
      </ContentContainer>
    </AccountDetailsContainer>
  );
};
