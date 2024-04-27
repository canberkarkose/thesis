import { Typography } from '@mui/material';

import { CardContainer, StyledIcon } from './InfoCard.styles';

type InfoCardProps = {
  icon?: React.ReactElement;
  title: string;
  text: string;
};

export const InfoCard = ({
  icon,
  title,
  text
}: InfoCardProps) => (
  <CardContainer>
    <StyledIcon>
      {icon}
    </StyledIcon>
    <Typography variant='h6' color='secondary.main'>
      {title}
    </Typography>
    <Typography>
      {text}
    </Typography>
  </CardContainer>
);
