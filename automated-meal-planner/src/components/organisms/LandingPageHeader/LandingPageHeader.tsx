import { Link, Typography } from '@mui/material';

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
      <Link href='/' style={{ textDecoration: 'none', display: 'flex', alignItems: 'center' }}>
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
      </Link>
    </LogoTitleContainer>
    <NavigationLinks>
      <NavLink href='/how-it-works'>How it works</NavLink>
      <NavLink href='/science-of-nutrition'>The Science of Nutrition</NavLink>
    </NavigationLinks>
  </HeaderContainer>
);
