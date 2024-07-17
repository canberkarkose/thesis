import { Link, Typography } from '@mui/material';

import {
  HeaderContainer,
  LogoContainer,
  LogoTitleContainer,
  NavigationLinks,
  NavLink
} from './LandingPageHeader.styles';

import { BTBLogo } from '@src/assets';

export const LandingPageHeader = () => (
  <HeaderContainer>
    <LogoTitleContainer>
      <Link href='/' style={{ textDecoration: 'none', display: 'flex', alignItems: 'center' }}>
        <LogoContainer>
          <BTBLogo />
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
