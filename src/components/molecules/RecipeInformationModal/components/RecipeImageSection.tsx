import React from 'react';
import { Typography } from '@mui/material';
import parse from 'html-react-parser';

import { dataTestIds } from '../../../../dataTest/dataTestIds';

import {
  RecipeImage,
  PlaceholderImage,
  Description,
  ContentContainer,
} from '../RecipeInformationModal.styles';

interface RecipeImageSectionProps {
  image: string;
  title: string;
  summary: string;
}

export const RecipeImageSection: React.FC<RecipeImageSectionProps> = ({
  image,
  title,
  summary,
}) => (
  <ContentContainer data-testid={dataTestIds.components.recipeImageSection.container}>
    {image ? (
      <RecipeImage
        src={image}
        alt={title}
        data-testid={dataTestIds.components.recipeImageSection.image}
      />
    ) : (
      <PlaceholderImage data-testid={dataTestIds.components.recipeImageSection.placeholderImage}>
        <Typography variant='body2' color='textSecondary' fontSize='1rem'>
          Image Unavailable
        </Typography>
      </PlaceholderImage>
    )}
    <Description data-testid={dataTestIds.components.recipeImageSection.description}>
      {parse(summary)}
    </Description>
  </ContentContainer>
);
