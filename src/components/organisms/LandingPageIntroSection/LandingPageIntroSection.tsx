import { Button, Typography } from '@mui/material';
import { Link } from 'react-router-dom';

import { useState } from 'react';

import { Space } from '../../atoms/Space/Space';

import {
  IntroContainer,
  ImageContainer,
  TextContainer,
  StyledIntroPlate,
  AnimatedIcon,
  StyledBiryani,
  StyledDiet,
  StyledDinner,
  StyledRamen,
  StyledSalad,
  StyledChicken,
  StyledTaco,
  StyledTurkey
} from './LandingPageIntroSection.styles';

const icons = [
  StyledBiryani,
  StyledDiet,
  StyledDinner,
  StyledRamen,
  StyledSalad,
  StyledChicken,
  StyledTaco,
  StyledTurkey
];

export const LandingPageIntroSection = () => {
  const [currentIconIndex, setCurrentIconIndex] = useState(0);

  const handleAnimationEnd = () => {
    setCurrentIconIndex((currentIconIndex + 1) % icons.length);
  };

  const CurrentIcon = icons[currentIconIndex];
  return (
    <IntroContainer>
      <TextContainer>
        <Typography variant='h4' color='primary.dark' fontSize='30px' fontWeight='bold' gutterBottom>
          Transform Your Eating Habits with Bite by Byte
        </Typography>
        <Typography variant='body1' color='text.primary' gutterBottom>
          Simplify your meal planning with Bite by Byte.
          Personalize your diet, save time, and achieve your nutrition goals effortlessly.
        </Typography>
        <Space s16 />
        <Button variant='contained' size='large' color='primary' component={Link} to='/register' sx={{ marginBottom: '10px', marginLeft: '2px' }}>
          Sign up now
        </Button>
        <Typography variant='subtitle2' sx={{ fontSize: '0.8rem' }}>
          Already a member?
          {' '}
          <Link to='/login'>Sign in</Link>
        </Typography>
      </TextContainer>
      <ImageContainer>
        <StyledIntroPlate />
        <AnimatedIcon key={currentIconIndex} onAnimationEnd={handleAnimationEnd}>
          <CurrentIcon />
        </AnimatedIcon>
      </ImageContainer>
    </IntroContainer>
  );
};
