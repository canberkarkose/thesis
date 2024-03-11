import styled from '@emotion/styled';
import { Box } from '@mui/material';

export const CardContainer = styled(Box)({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: 20,
  textAlign: 'center',
  padding: '20px',
  border: '1px solid #000',
  backgroundColor: '#fff',
  maxWidth: '300px',
  margin: '0 auto'
});
