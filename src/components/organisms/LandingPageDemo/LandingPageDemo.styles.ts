import styled from '@emotion/styled';
import { Box } from '@mui/material';

export const DemoContainer = styled(Box)`
  height: 500px;
  border: 1px solid #000;
  background-color: #fff;
  text-align: center;
  max-width: 900px;
  margin: 0 auto;

  @media (max-width: 768px) {
    max-width: 100%;
    margin-left: 0;
    margin-top: 20px;
  }
`;
