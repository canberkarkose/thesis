import { Box } from '@mui/material';
import styled from '@emotion/styled';

export const IntroContainer = styled(Box)`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 20px;
  padding: 5vh 5vw;

  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

export const TextContainer = styled(Box)`
  flex: 1;
  max-width: 500px;
  height: 250px;

  @media (max-width: 768px) {
    max-width: 100%;
  }
`;

export const ImageContainer = styled(Box)`
  flex: 1;
  max-width: 500px;
  height: 250px;
  margin-left: 20px;
  border: 1px solid #000;
  background-color: #fff;

  @media (max-width: 768px) {
    max-width: 100%;
    margin-left: 0;
    margin-top: 20px;
  }
`;
