import styled from '@emotion/styled';

import { Typography } from '@mui/material';

import backgroundImage from '@src/assets/background.png';

import globalBackground from '@src/assets/globalBackground.png';

export const GlobalBackground = styled.div`
  background-image: url(${globalBackground});
  background-size: cover;
  background-position: center;
  position: relative;

  &:before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(255, 255, 255, 0.25);
    z-index: 0;
  }

`;

export const MainContentContainer = styled.div`
  width: 100%;
  max-width: 1000px;
  margin: 0 auto;
  padding: 20px;
  background-image: url(${backgroundImage});
  background-size: cover;
  background-position: center;
  position: relative;
  &:before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(255, 255, 255, 0.7);
    z-index: 0;
  }
  &:after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: radial-gradient(circle, transparent 50%, rgba(255, 255, 255, 0.8) 100%);
    z-index: 1;
  }
  > * {
    position: relative;
    z-index: 2;
  }
  @media (min-width: 1600px) {
    max-width: 1300px;
    padding: 40px;
  }
`;

export const DemoInvitation = styled(Typography)`
  text-align: center;
`;
