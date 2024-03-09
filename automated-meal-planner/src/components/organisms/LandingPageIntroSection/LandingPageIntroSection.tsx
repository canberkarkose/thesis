import { Button, Typography } from '@mui/material';
import { Link } from 'react-router-dom';

import { Space } from '../../atoms/Space/Space';

import {
  IntroContainer,
  ImageContainer,
  TextContainer,
} from './LandingPageIntroSection.styles';

export const LandingPageIntroSection = () => (
  <IntroContainer>
    <TextContainer>
      <Typography variant='h4' color='primary.dark' fontSize='30px' fontWeight='bold' gutterBottom>
        Transform Your Eating Habits with Bite by Byte
      </Typography>
      <Typography variant='body1' gutterBottom>
        Simplify your meal planning with Bite by Byte.
        Personalize your diet, save time, and achieve your nutrition goals effortlessly.
      </Typography>
      <Space s16 />
      <Button variant='contained' size='large' color='primary' component={Link} to='/register' sx={{ marginBottom: '10px' }}>
        Sign up now
      </Button>
      <Typography variant='subtitle2' sx={{ fontSize: '0.7rem', ml: 0.5 }}>
        Already a member?
        {' '}
        <Link to='/login'>Sign in</Link>
      </Typography>
    </TextContainer>
    <ImageContainer />
  </IntroContainer>
);
