import { Button, Typography } from '@mui/material';

import { DemoContentWrapper } from '../templates/DemoContentWrapper';

interface QuizDemoProps {
  onBack: () => void;
}

export const QuizDemo = ({ onBack }: QuizDemoProps) => (
  <DemoContentWrapper
    headline='Take the Meal Quiz'
    subheading='Answer a few questions to generate a personalized menu'
  >
    <Typography variant='body1'>Quiz Demo - Under Construction</Typography>
    <Button variant='contained' onClick={onBack}>
      Back
    </Button>
  </DemoContentWrapper>
);
