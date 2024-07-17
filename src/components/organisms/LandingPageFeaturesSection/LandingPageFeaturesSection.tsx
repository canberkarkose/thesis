import { Box, Button, Typography } from '@mui/material';

import { Link } from 'react-router-dom';

import { Space } from '../../atoms/Space/Space';

import { InfoCard } from '../../molecules/InfoCard/InfoCard';

import { StressFreeLogo, PlateLogo, ShoppingListLogo } from '@src/assets';

const features = [
  {
    icon: <PlateLogo />,
    title: 'Empower Your Plate',
    text: 'Simplify your meal planning with Bite by Byte. From vegan to Mediterranean, customize your diet to fit your lifestyle and nutrition goals effortlessly!'
  },
  {
    icon: <StressFreeLogo />,
    title: 'Stress-Free Meal Decisions',
    text: 'Let Bite by Byte handle the meal planning. Say goodbye to the daily "what\'s for dinner?" dilemma and enjoy the pleasure of cooking and eating.'
  },
  {
    icon: <ShoppingListLogo />,
    title: 'Streamlined Grocery Planning',
    text: ' Revolutionize shopping with auto-generated lists from your meal plans, ensuring you\'re always ready for a week of delicious dining.'
  },
];

export const LandingPageFeaturesSection = () => (
  <>
    <Box sx={{ display: 'flex', justifyContent: 'center', marginBottom: '20px' }}>
      <Typography variant='h4' component='h2' color='primary.dark' align='center' sx={{ fontWeight: 'bold', lineHeight: 1.2 }}>
        Unlock the Simplicity of Smart, and Sustainable Eating
      </Typography>
    </Box>
    <Space s32 />
    <Box sx={{ display: 'flex', justifyContent: 'space-around', alignItems: 'center' }}>
      {features.map((feature) => (
      // eslint-disable-next-line react/jsx-props-no-spreading
        <InfoCard {...feature} />
      ))}
    </Box>
    <Space s32 />
    <Space s32 />
    <Box sx={{ display: 'flex', justifyContent: 'center' }}>
      <Button variant='contained' size='large' color='primary' component={Link} to='/register'>
        Create your free account now!
      </Button>
    </Box>
  </>
);
