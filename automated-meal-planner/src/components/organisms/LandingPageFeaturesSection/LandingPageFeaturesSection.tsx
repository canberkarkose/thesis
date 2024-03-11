import Box from '@mui/material/Box';

import { InfoCard } from '../../molecules/InfoCard/InfoCard';

const features = [
  {
    title: 'Empower Your Plate',
    text: 'Simplify your meal planning with Bite by Byte...'
  },
  {
    title: 'Stress-Free Meal Decisions',
    text: 'Let Bite by Byte handle the meal planning...'
  },
  {
    title: 'Streamlined Grocery Planning',
    text: 'Revolutionize shopping with auto-generated lists...'
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
