import { useEffect, useState } from 'react';
import {
  Button,
  Typography,
  Box,
  Grid
} from '@mui/material';

import { useTheme } from '@mui/material/styles';

import { StepContentWrapper } from './Steps.styles';

import { cuisines } from './constants';

type AccountDetailsStepThreeProps = {
  handleBack: () => void;
  handleNext: () => void;
  updateCuisines: (
    cuisineDetails: { includedCuisines: string[], excludedCuisines: string[] }
  ) => void;
  cuisinePreferences: { includedCuisines: string[], excludedCuisines: string[] };
};

export const AccountDetailsStepThree = (
  {
    handleBack,
    handleNext,
    updateCuisines,
    cuisinePreferences
  }: AccountDetailsStepThreeProps
) => {
  const theme = useTheme();
  const [includedCuisines, setIncludedCuisines] = useState<string[]>([]);
  const [excludedCuisines, setExcludedCuisines] = useState<string[]>([]);

  useEffect(() => {
    if (cuisinePreferences.includedCuisines.length === 0
      && cuisinePreferences.excludedCuisines.length === 0) {
      setIncludedCuisines(cuisines);
      setExcludedCuisines([]);
    } else {
      // If they are not empty, set them based on the existing preferences
      setIncludedCuisines(cuisinePreferences.includedCuisines);
      setExcludedCuisines(cuisinePreferences.excludedCuisines);
    }
  }, [cuisinePreferences]);

  const handleLocalNext = () => {
    const cuisineDetails = {
      includedCuisines,
      excludedCuisines
    };
    updateCuisines(cuisineDetails);
    handleNext();
  };

  const handleInclude = (cuisine: string) => {
    if (!includedCuisines.includes(cuisine)) {
      setIncludedCuisines((prev) => [...prev, cuisine]);
    }
    setExcludedCuisines((prev) => prev.filter((item) => item !== cuisine));
  };

  const handleExclude = (cuisine: string) => {
    if (!excludedCuisines.includes(cuisine)) {
      setExcludedCuisines((prev) => [...prev, cuisine]);
    }
    setIncludedCuisines((prev) => prev.filter((item) => item !== cuisine));
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
          marginBottom: '3%'
        }}
      >
        Select Your Cuisine Preferences:
      </Typography>
      <Grid container spacing={2} justifyContent='center'>
        {cuisines.map((cuisine) => (
          <Grid item xs={12} sm={6} md={4} key={cuisine}>
            <Box display='flex' justifyContent='space-between' alignItems='center' gap={1}>
              <Typography>
                {cuisine}
              </Typography>
              <div style={{ display: 'flex', gap: '10px' }}>
                <Button
                  size='small'
                  variant={includedCuisines.includes(cuisine) ? 'contained' : 'outlined'}
                  color='secondary'
                  style={{
                    color: includedCuisines.includes(cuisine) ? 'white' : theme.palette.secondary.main,
                    borderRadius: 5,
                    border: '0.5px solid rgba(0, 0, 0, 1)',
                  }}
                  onClick={() => handleInclude(cuisine)}
                >
                  Include
                </Button>
                <Button
                  size='small'
                  variant={excludedCuisines.includes(cuisine) ? 'contained' : 'outlined'}
                  color='secondary'
                  style={{
                    color: excludedCuisines.includes(cuisine) ? 'white' : theme.palette.secondary.main,
                    backgroundColor: excludedCuisines.includes(cuisine) ? '#95190C' : '',
                    borderRadius: 5,
                    border: '0.5px solid rgba(0, 0, 0, 1)',
                  }}
                  onClick={() => handleExclude(cuisine)}
                >
                  Exclude
                </Button>
              </div>
            </Box>
          </Grid>
        ))}
      </Grid>
      <div style={{
        display: 'flex', marginTop: '4%'
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
