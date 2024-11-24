import React from 'react';
import { Typography } from '@mui/material';
import parse from 'html-react-parser';

import {
  RecipeImage,
  PlaceholderImage,
  Description,
  ContentContainer,
} from './RecipeInformationModal.styles';

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
  <ContentContainer>
    {image ? (
      <RecipeImage src={image} alt={title} />
    ) : (
      <PlaceholderImage>
        <Typography variant='body2' color='textSecondary' fontSize='1rem'>
          Image Unavailable
        </Typography>
      </PlaceholderImage>
    )}
    <Description>{parse(summary)}</Description>
  </ContentContainer>
);
