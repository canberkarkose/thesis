import { useState } from 'react';
import {
  Button, Typography, Grid, Tooltip, Box
} from '@mui/material';

import { DemoContentWrapper } from '../templates/DemoContentWrapper';

import { demoDietOptions, demoIntolerances, demoCuisines } from '@components/pages/AccountDetails/Steps/constants';
import { Space } from '@components/atoms/Space/Space';

interface ManualDemoProps {
  onBack: () => void;
  onGenerateMeals: (diet: string, intolerances: string[], cuisines: string[]) => void;
}

export const ManualDemo = ({ onBack, onGenerateMeals }: ManualDemoProps) => {
  const [selectedDiet, setSelectedDiet] = useState<string>('anything');
  const [selectedIntolerances, setSelectedIntolerances] = useState<string[]>([]);
  const [selectedCuisines, setSelectedCuisines] = useState<string[]>([]);

  const handleDietSelect = (diet: string) => {
    setSelectedDiet(diet);
  };

  const handleCuisineToggle = (cuisine: string) => {
    // eslint-disable-next-line max-len
    setSelectedCuisines((prev) => (prev.includes(cuisine) ? prev.filter((item) => item !== cuisine) : [...prev, cuisine]));
  };

  const handleGenerateMeals = () => {
    onGenerateMeals(selectedDiet, selectedIntolerances, selectedCuisines);
  };

  return (
    <DemoContentWrapper
      headline='Create Your Own Meals'
      subheading='Select your preferences to generate meals'
      shouldDisplayGoBackButton
      onBack={onBack}
    >
      <Space s32 />
      <Space s16 />
      <Box display='flex' justifyContent='space-between' width='100%'>

        {/* Diet Options */}
        <Box flex={1} padding='0 16px'>
          <Typography variant='body1' gutterBottom>
            Select a Diet
          </Typography>
          <Space s12 />
          <Grid container spacing={1} justifyContent='center'>
            {demoDietOptions.map((diet) => (
              <Grid item xs={6} key={diet.value}>
                <Tooltip title={diet.label} arrow>
                  <Button
                    onClick={() => handleDietSelect(diet.value)}
                    variant={selectedDiet === diet.value ? 'contained' : 'outlined'}
                    sx={{
                      border: selectedDiet === diet.value ? '2px solid #006400' : '2px solid #228B22', // Dark green color when not selected
                      minWidth: 55,
                      minHeight: 55,
                      maxHeight: 55,
                      maxWidth: 55,
                      padding: '6px',
                      '&:hover': {
                        backgroundColor: selectedDiet === diet.value ? '#004d00' : '#f0f0f0', // Darken effect for selected and non-selected
                      },
                    }}
                    size='small'
                  >
                    {diet.icon}
                  </Button>
                </Tooltip>
              </Grid>
            ))}
          </Grid>
        </Box>

        {/* Intolerance Options */}
        <Box flex={1} padding='0 16px'>
          <Typography variant='body1' gutterBottom>
            Select Intolerances
          </Typography>
          <Space s12 />
          <Grid container spacing={1} justifyContent='center'>
            {demoIntolerances.map((intolerance) => (
              <Grid item xs={6} key={intolerance}>
                <Button
                  onClick={() => {
                    const isSelected = selectedIntolerances.includes(intolerance);
                    // eslint-disable-next-line max-len
                    setSelectedIntolerances((prev) => (isSelected ? prev.filter((item) => item !== intolerance) : [...prev, intolerance]));
                  }}
                  variant={selectedIntolerances.includes(intolerance) ? 'contained' : 'outlined'}
                  sx={{
                    border: selectedIntolerances.includes(intolerance) ? '2px solid #006400' : '2px solid #228B22',
                    minWidth: 55,
                    minHeight: 55,
                    maxHeight: 55,
                    maxWidth: 55,
                    color: selectedIntolerances.includes(intolerance) ? 'black' : '#228B22', // Text color adjustment
                    fontSize: '0.75rem',
                    '&:hover': {
                      backgroundColor: selectedIntolerances.includes(intolerance) ? '#004d00' : '#f0f0f0',
                    }
                  }}
                >
                  {intolerance}
                </Button>
              </Grid>
            ))}
          </Grid>
        </Box>

        {/* Cuisine Options */}
        <Box flex={1} padding='0 16px'>
          <Typography variant='body1' gutterBottom>
            Select Cuisines
          </Typography>
          <Space s12 />
          <Grid container spacing={1} justifyContent='center'>
            {demoCuisines.map((cuisine) => (
              <Grid item xs={6} key={cuisine.value}>
                <Tooltip title={cuisine.label} arrow>
                  <Button
                    onClick={() => handleCuisineToggle(cuisine.value)}
                    variant={selectedCuisines.includes(cuisine.value) ? 'contained' : 'outlined'}
                    sx={{
                      border: selectedCuisines.includes(cuisine.value) ? '2px solid #006400' : '2px solid #228B22',
                      minWidth: 55,
                      minHeight: 55,
                      maxHeight: 55,
                      maxWidth: 55,
                      padding: '6px',
                      '&:hover': {
                        backgroundColor: selectedCuisines.includes(cuisine.value) ? '#004d00' : '#f0f0f0',
                      }
                    }}
                    data-testid={`cuisine-${cuisine.value}`}
                  >
                    {cuisine.icon}
                  </Button>
                </Tooltip>
              </Grid>
            ))}
          </Grid>
        </Box>
      </Box>
      <Space s32 />
      <div style={{
        marginTop: '20px', display: 'flex', justifyContent: 'space-between', gap: '20px'
      }}
      >
        <Button variant='contained' onClick={handleGenerateMeals}>
          Generate Meals
        </Button>
      </div>
    </DemoContentWrapper>
  );
};
