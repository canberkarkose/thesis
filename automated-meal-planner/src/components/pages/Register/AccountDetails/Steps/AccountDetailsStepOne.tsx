import { useEffect, useState } from 'react';

import { Button, Typography, ToggleButton } from '@mui/material';

import {
  StepContentWrapper,
  StyledToggleButtonGroup,
} from './Steps.styles';

import { dietOptions } from './constants';

type AccountDetailsStepOneProps = {
  handleNext: () => void;
  updateDietDetails: (diet: string) => void;
  userDiet: string;
};

export const AccountDetailsStepOne = (
  { handleNext, updateDietDetails, userDiet }: AccountDetailsStepOneProps
) => {
  const [selectedDiet, setSelectedDiet] = useState('');

  useEffect(() => {
    setSelectedDiet(userDiet);
  }, [userDiet]);

  const handleLocalNext = () => {
    updateDietDetails(selectedDiet);
    handleNext();
  };

  const handleDietChange = (newDiet: string | null) => {
    if (newDiet !== null) {
      setSelectedDiet(newDiet);
    }
  };

  return (
    <StepContentWrapper>
      <div style={{ marginBottom: '2%' }}>
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
          Select Your Nutrition Path
        </Typography>
      </div>
      <StyledToggleButtonGroup
        value={selectedDiet}
        exclusive
        onChange={(_e, newDiet) => handleDietChange(newDiet)}
        aria-label='diet'
        orientation='vertical'
      >
        {dietOptions.map((diet) => (
          <ToggleButton
            value={diet.value}
            key={diet.value}
            aria-label={diet.label}
            style={{
              marginBottom: '10px',
              textAlign: 'left',
            }}
          >
            {diet.icon && <div style={{ marginRight: '10px' }}>{diet.icon}</div>}
            <div>
              <Typography variant='body1' component='div' style={{ fontWeight: '500' }}>{diet.label}</Typography>
              <Typography variant='body2' component='div'>{diet.description}</Typography>
            </div>
          </ToggleButton>
        ))}
      </StyledToggleButtonGroup>
      <Button variant='contained' onClick={handleLocalNext} style={{ marginTop: '2%' }}>
        Next
      </Button>
    </StepContentWrapper>
  );
};
