import { Box, Typography } from '@mui/material';

import { CardContainer } from './InfoCard.styles';

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
    <Box component='span'>
      {icon}
    </Box>
    <Typography variant='h6' color='secondary.main'>
      {title}
    </Typography>
    <Typography>
      {text}
    </Typography>
  </CardContainer>
);
