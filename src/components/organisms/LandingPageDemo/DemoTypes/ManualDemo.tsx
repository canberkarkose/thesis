import { Button, Typography } from '@mui/material';

interface ManualDemoFormProps {
  onBack: () => void;
}

export const ManualDemo = ({ onBack }: ManualDemoFormProps) => (
  <div>
    <Typography variant='h5'>Manual Demo Form - Under Construction</Typography>
    <Button variant='contained' onClick={onBack}>
      Back
    </Button>
  </div>
);
