import styled from '@emotion/styled';
import { Button } from '@mui/material';

export const AccountDetailsContainer = styled.div`
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #4e6356;
  width: 100%;
`;

export const ContentContainer = styled.div`
  background-color: #BFE8D2;
  width: 85%;
  height: 650px;
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
  position: relative;
  border-radius: 15px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  @media (min-width: 1600px) {
    max-width: 1600px;
    height: 800px;
    padding: 40px;
  }

  @media (max-width: 768px) {
    width: 95%;
    height: auto;
    padding: 10px;
  }
`;

export const StyledButton = styled(Button)({
  marginBottom: '15px',
  marginRight: '15px',
  borderRadius: '10px',
  backgroundColor: '#7D9F8B',
  color: 'white',
  '&:hover': {
    backgroundColor: '#4e6356',
    opacity: 0.8,
  },
});
