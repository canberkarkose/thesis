import styled from '@emotion/styled';
import { Box, Typography } from '@mui/material';

export const DemoContainer = styled(Box)`
  height: 500px;
  background-color: #fff;
  text-align: center;
  max-width: 900px;
  margin: 0 auto;
  position: relative;
  overflow: hidden;

  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  /* Animated background can be added here */
  background-image: url('/path-to-your-animated-background.svg');
  background-size: cover;
  background-position: center;

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
  margin-bottom: 32px;
  text-align: center;
`;

export const ButtonsContainer = styled(Box)`
  display: flex;
  flex-direction: row;
  gap: 16px;
  flex-wrap: wrap;
  justify-content: center;
`;
