import { Button } from '@mui/material';

import MenuIcon from '@mui/icons-material/Menu';
import QuizIcon from '@mui/icons-material/Quiz';

import {
  DemoContainer, Headline, Subheading, ButtonsContainer
} from './LandingPageDemo.styles';

interface LandingPageDemoPresentationProps {
  onSelectDemo: (option: 'manual' | 'quiz') => void;
}

export const LandingPageDemoPresentation = ({ onSelectDemo }: LandingPageDemoPresentationProps) => (
  <DemoContainer>
    <Headline variant='h4'>Not Quite Ready To Sign Up?</Headline>
    <Subheading variant='subtitle1'>
      Try our quick demos and get a taste of what&apos;s cooking!
    </Subheading>
    <ButtonsContainer>
      <Button
        variant='contained'
        color='primary'
        size='large'
        startIcon={<MenuIcon />}
        onClick={() => onSelectDemo('manual')}
      >
        Create Your Own Menu
      </Button>
      <Button
        variant='contained'
        color='secondary'
        size='large'
        startIcon={<QuizIcon />}
        onClick={() => onSelectDemo('quiz')}
      >
        Take the Meal Quiz
      </Button>
    </ButtonsContainer>
  </DemoContainer>
);
