import { Box, Typography } from '@mui/material';

interface StepProps {
  imageSrc: string;
  title: string;
  description: string;
  reverse: boolean;
}

export const Step = (
  {
    imageSrc, title, description, reverse
  }: StepProps
) => (
  <Box
    display='flex'
    flexDirection={reverse ? 'row-reverse' : 'row'}
    alignItems='center'
  >
    <Box flex={1} padding='16px'>
      <img
        src={imageSrc}
        alt={title}
        style={
          {
            maxWidth: '350px',
            maxHeight: '350px',
            marginLeft: reverse ? '15%' : '5%',
          }
        }
      />
    </Box>
    <Box
      flex={1}
      padding='16px'
      bgcolor='rgba(255, 255, 255, 0.8)'
      textAlign='center'
      borderRadius='15px'
      boxShadow='0 4px 8px rgba(0, 0, 0, 0.1)'
      marginLeft={reverse ? '2%' : '0'}
      marginRight={reverse ? '0' : '2%'}
      sx={{
        '&:hover': { transform: 'scale(1.05)', transition: 'transform 0.2s' }
      }}
    >
      <Typography variant='h6' fontWeight='bold' gutterBottom>
        {title}
      </Typography>
      <Typography variant='subtitle1'>{description}</Typography>
    </Box>

  </Box>
);
