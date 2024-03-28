import styled from '@emotion/styled';
import { Box } from '@mui/material';

export const CardContainer = styled(Box)({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: 20,
  textAlign: 'center',
  width: '300px',
  height: '350px',
  margin: '0 auto',
  padding: '15px',
  backgroundColor: '#ffffff',
  background: 'linear-gradient(145deg, #f5f5f5, #ffffff)',
  borderRadius: '15px',
  boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
  transition: 'transform 0.2s',
  '&:hover': {
    transform: 'scale(1.05)',
  },
});

export const StyledIcon = styled(Box)`
  svg {
    width: 100px;
    height: 100px;
    filter: drop-shadow(2px 4px 6px rgba(0, 0, 0, 0.2)); // Soft shadow for the icon
  }
`;
