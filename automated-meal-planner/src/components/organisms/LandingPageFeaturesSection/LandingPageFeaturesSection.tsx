import Box from '@mui/material/Box';

import { InfoCard } from '../../molecules/InfoCard/InfoCard';

const features = [
  {
    title: 'Empower Your Plate',
    text: 'Simplify your meal planning with Bite by Byte. From vegan to Mediterranean, customize your diet to fit your lifestyle and nutrition goals effortlessly!'
  },
  {
    title: 'Stress-Free Meal Decisions',
    text: 'Let Bite by Byte handle the meal planning. Say goodbye to the daily "what\'s for dinner?" dilemma and enjoy the pleasure of cooking and eating.'
  },
  {
    title: 'Streamlined Grocery Planning',
    text: ' Revolutionize shopping with auto-generated lists from your meal plans, ensuring you\'re always ready for a week of delicious dining.'
  },
];

export const LandingPageFeaturesSection = () => (
  <Box sx={{ display: 'flex', justifyContent: 'space-around', alignItems: 'center' }}>
    {features.map((feature) => (
      // eslint-disable-next-line react/jsx-props-no-spreading
      <InfoCard {...feature} />
    ))}
  </Box>
);
