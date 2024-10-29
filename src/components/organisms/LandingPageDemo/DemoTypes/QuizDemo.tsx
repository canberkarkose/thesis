import { Button, Typography } from '@mui/material';

interface QuizDemoProps {
  onBack: () => void;
}

export const QuizDemo = ({ onBack }: QuizDemoProps) => (
  <div>
    <Typography variant='h5'>Quiz Demo - Under Construction</Typography>
    <Button variant='contained' onClick={onBack}>
      Back
    </Button>
  </div>
);
