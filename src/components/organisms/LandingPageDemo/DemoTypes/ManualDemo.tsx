import { Button, Typography } from '@mui/material';

import { DemoContentWrapper } from '../templates/DemoContentWrapper';

interface ManualDemoProps {
  onBack: () => void;
}

export const ManualDemo = ({ onBack }: ManualDemoProps) => (
  <DemoContentWrapper
    headline='Create Your Own Menu'
    subheading='Select your preferences to generate a menu'
  >
    <Typography variant='body1'>Manual Demo Form - Under Construction</Typography>
    <Button variant='contained' onClick={onBack}>
      Back
    </Button>
  </DemoContentWrapper>
);
