import React from 'react';
import { Box } from '@mui/material';

import {
  InfoRowInner,
  InfoText,
  InfoTitle,
  InfoValue,
  CaloriesContainer,
} from '../RecipeInformationModal.styles';

interface RecipeInfoDetailsProps {
  readyInMinutes: number | string;
  servings: number | string;
  caloriesPerServing: string;
}

export const RecipeInfoDetails: React.FC<RecipeInfoDetailsProps> = ({
  readyInMinutes,
  servings,
  caloriesPerServing,
}) => (
  <Box
    sx={{
      backgroundColor: '#ededed',
      borderRadius: '12px',
      padding: '16px',
    }}
  >
    <InfoRowInner>
      <InfoText>
        <InfoTitle>Ready in:</InfoTitle>
        <InfoValue>
          &nbsp;
          {readyInMinutes}
          {' '}
          minutes
        </InfoValue>
      </InfoText>
      <InfoText>
        <InfoTitle>Servings:</InfoTitle>
        <InfoValue>
          &nbsp;
          {servings}
        </InfoValue>
      </InfoText>
    </InfoRowInner>
    <CaloriesContainer>
      <InfoText>
        <InfoTitle>Calories per serving:</InfoTitle>
        <InfoValue>
          &nbsp;
          {caloriesPerServing}
        </InfoValue>
      </InfoText>
    </CaloriesContainer>
  </Box>
);
