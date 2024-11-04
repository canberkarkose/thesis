import styled from '@emotion/styled';
import { Box, Typography } from '@mui/material';

import demoBackground from '@src/assets/demoBackground.png';

interface DemoContainerProps {
  isOpeningScreen?: boolean;
  isQuiz?: boolean;
}

export const DemoContainer = styled(Box)<DemoContainerProps>`
  height: 550px;
  text-align: center;
  max-width: 900px;
  margin: 0 auto;
  position: relative;

  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flext-start;
    ${(props) => (props.isOpeningScreen
    ? 'padding-top: 125px;'
    : props.isQuiz ? 'padding-top: 95px;'
    : 'padding-top: 50px;'
  )}

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
