import {
  Button, Typography, Tooltip, Grid, Paper
} from '@mui/material';
import InfoIcon from '@mui/icons-material/Info';

import { StepContentWrapper } from './Steps.styles';

import { CuisinePreferences } from './types/Step.types';

import { findDietLabel } from './constants';

interface FinalReviewData {
  diet: string;
  intolerances: string[];
  cuisinePreferences: CuisinePreferences;
}

type FinalReviewStepProps = {
  handleBack: () => void;
  handleSubmit: () => void;
  data: FinalReviewData;
};

type ListWithTooltipProps = {
  items: string[];
  maxItems?: number;
};

const ListWithTooltip = ({ items, maxItems = 3 }: ListWithTooltipProps) => {
  const visibleItems = items.slice(0, maxItems);
  const tooltipItems = items.slice(maxItems);
  return (
    <span>
      <strong>{visibleItems.join(', ')}</strong>
      {tooltipItems.length > 0 && (
        <Tooltip title={tooltipItems.join(', ')} style={{ cursor: 'help' }}>
          <strong><span> ...</span></strong>
        </Tooltip>
      )}
    </span>
  );
};

export const FinalReviewStep = (
  { handleBack, handleSubmit, data }: FinalReviewStepProps
) => (
  <StepContentWrapper>
    <Typography
      variant='h5'
      style={{
        fontWeight: 'bold',
        color: '#333',
        marginBottom: '8%',
        textShadow: '1px 1px 2px rgba(0,0,0,0.1)',
      }}
    >
      Final Review of Your Preferences
    </Typography>
    <Paper style={{
      padding: '16px',
      marginBottom: '4%',
      width: '60%',
      backgroundColor: '#8AAF99'
    }}
    >
      <Grid container spacing={1.5}>
        <Grid item xs={4}>
          <Typography variant='body1' style={{ color: '#333' }}>Diet Preference:</Typography>
        </Grid>
        <Grid item xs={8}>
          <Typography variant='body1' style={{ color: 'white' }}>
            <strong>
              {findDietLabel(data.diet).charAt(0).toUpperCase() + findDietLabel(data.diet).slice(1)}
            </strong>
          </Typography>
        </Grid>
        <Grid item xs={4}>
          <Typography variant='body1' style={{ color: '#333' }}>Intolerances:</Typography>
        </Grid>
        <Grid item xs={8}>
          <Typography variant='body1' style={{ color: 'white' }}>
            <ListWithTooltip items={data.intolerances.length > 0 ? data.intolerances : ['None']} />
          </Typography>
        </Grid>
        <Grid item xs={4}>
          <Typography variant='body1' style={{ color: '#333' }}>Included Cuisines:</Typography>
        </Grid>
        <Grid item xs={8}>
          <Typography variant='body1' style={{ color: 'white' }}>
            <ListWithTooltip items={data.cuisinePreferences.includedCuisines.length > 0 ? data.cuisinePreferences.includedCuisines : ['None']} />
          </Typography>
        </Grid>

        <Grid item xs={4}>
          <Typography variant='body1' style={{ color: '#333' }}>Excluded Cuisines:</Typography>
        </Grid>
        <Grid item xs={8}>
          <Typography variant='body1' style={{ color: 'white' }}>
            <ListWithTooltip items={data.cuisinePreferences.excludedCuisines.length > 0 ? data.cuisinePreferences.excludedCuisines : ['None']} />
          </Typography>
        </Grid>
      </Grid>
    </Paper>
    <Typography
      variant='subtitle2'
      style={{
        color: '#666',
        fontStyle: 'italic',
        textAlign: 'center',
      }}
    >
      <InfoIcon color='primary' style={{ fontSize: '1.5rem', verticalAlign: 'middle', marginTop: '0.1%' }} />
      {' '}
      Please confirm your selections.
      You can modify these preferences at any time from your profile settings.
    </Typography>
    <div style={{
      display: 'flex', justifyContent: 'space-between', marginTop: '10%'
    }}
    >
      <Button variant='contained' onClick={handleBack} sx={{ mr: 1 }}>
        Back
      </Button>
      <Button variant='contained' onClick={handleSubmit}>
        Confirm & Submit
      </Button>
    </div>
  </StepContentWrapper>
);
