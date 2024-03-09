import Typography from '@mui/material/Typography';

import { ReactComponent as Logo } from '../../../assets/logo.svg';

import {
  HeaderContainer,
  LogoContainer,
  LogoTitleContainer,
  NavigationLinks,
  NavLink
} from './LandingPageHeader.styles';

export const LandingPageHeader = () => (
  <HeaderContainer>
    <LogoTitleContainer>
      <LogoContainer>
        <Logo />
      </LogoContainer>
      <Typography
        variant='h5'
        component='h1'
        sx={{ fontWeight: 'bold', color: 'white', lineHeight: 1.2 }}
      >
        Bite
        <br />
        by
        <br />
        Byte
      </Typography>
    </LogoTitleContainer>
    <NavigationLinks>
      <NavLink href='/how-it-works'>How it works</NavLink>
      <NavLink href='/science-of-nutrition'>The Science of Nutrition</NavLink>
    </NavigationLinks>
  </HeaderContainer>
);
