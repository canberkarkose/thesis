import { useEffect, useState } from 'react';

import {
  Button,
  FormControl, Typography
} from '@mui/material';

import { intolerancesTypes } from './constants';

import { StepContentWrapper, IntoleranceButton } from './Steps.styles';

type AccountDetailsStepTwoProps = {
  handleBack: () => void;
  handleNext: () => void;
  updateIntolerances: (intolerancesTypes: string[]) => void;
  intolerances: string[];
};

export const AccountDetailsStepTwo = (
  {
    handleBack,
    handleNext,
    updateIntolerances,
    intolerances
  }: AccountDetailsStepTwoProps
) => {
  const [selectedIntolerances, setSelectedIntolerances] = useState<string[]>(intolerances);

  useEffect(() => {
    setSelectedIntolerances(intolerances);
  }, [intolerances]);

  const handleLocalNext = () => {
    updateIntolerances(selectedIntolerances);
    handleNext();
  };

  const handleToggle = (intolerance: string) => {
    setSelectedIntolerances((prev) => (prev.includes(intolerance)
      ? prev.filter((item) => item !== intolerance)
      : [...prev, intolerance]));
  };

  return (
    <StepContentWrapper>
      <Typography
        variant='h6'
        gutterBottom
        style={{
          fontWeight: 600,
          color: '#333',
          letterSpacing: '0.5px',
          lineHeight: '1.4',
          textShadow: '1px 1px 2px rgba(0,0,0,0.1)',
        }}
      >
        Select Your Intolerances
      </Typography>
      <FormControl
        component='fieldset'
        sx={{
          display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', width: '100%'
        }}
      >
        <div style={{
          display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '16px', width: '100%', marginTop: '9%'
        }}
        >
          {intolerancesTypes.map((intolerance) => (
            <IntoleranceButton
              key={intolerance}
              variant='outlined'
              onClick={() => handleToggle(intolerance)}
              className={selectedIntolerances.includes(intolerance) ? 'selected' : ''}
            >
              {intolerance}
            </IntoleranceButton>
          ))}
        </div>
      </FormControl>
      <div style={{
        display: 'flex', marginTop: '13%'
      }}
      >
        <Button variant='contained' onClick={handleBack} sx={{ mr: 1 }}>
          Back
        </Button>
        <Button variant='contained' onClick={handleLocalNext}>
          Next
        </Button>
      </div>
    </StepContentWrapper>
  );
};
