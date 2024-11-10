// InfoCard.tsx

import React from 'react';
import { Typography } from '@mui/material';

import { dataTestIds } from '../../../dataTest/dataTestIds';

import { CardContainer, StyledIcon } from './InfoCard.styles';

type InfoCardProps = {
  icon: React.ReactElement;
  title: string;
  text: string;
};

export const InfoCard = ({
  icon,
  title,
  text
}: InfoCardProps) => (
  <CardContainer data-testid={dataTestIds.components.infoCard.container}>
    <StyledIcon data-testid={dataTestIds.components.infoCard.icon}>
      {icon}
    </StyledIcon>
    <Typography
      data-testid={dataTestIds.components.infoCard.title}
      variant='h6'
      color='secondary.main'
    >
      {title}
    </Typography>
    <Typography data-testid={dataTestIds.components.infoCard.text}>
      {text}
    </Typography>
  </CardContainer>
);
