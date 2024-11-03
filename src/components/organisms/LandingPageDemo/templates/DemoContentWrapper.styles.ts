import styled from '@emotion/styled';
import { Box, Typography } from '@mui/material';

import demoBackground from '@src/assets/demoBackground.png';

export const DemoContainer = styled(Box)`
  height: 500px;
  text-align: center;
  max-width: 1000px;
  margin: 0 auto;
  position: relative;

  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flext-start;
  padding-top: 100px;

  background-image: url(${demoBackground});
  background-position: center;
  background-size: cover;
  > * {
    position: relative;
    z-index: 1;
  }

  .particles {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 0;
    pointer-events: none;
  }

  @media (max-width: 768px) {
    max-width: 100%;
    margin-left: 0;
    margin-top: 20px;
  }
`;

export const Headline = styled(Typography)`
  margin-bottom: 16px;
  text-align: center;
`;

export const Subheading = styled(Typography)`
  text-align: center;
`;
