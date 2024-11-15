import { styled } from '@mui/material/styles';
import { Box } from '@mui/material';

export const RecipeCardContainer = styled(Box)(() => ({
  backgroundColor: 'rgba(235, 235, 235, 0.9)',
  borderRadius: '12px',
  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
  overflow: 'hidden',
  width: '100%',
  maxWidth: '350px',
  margin: '16px',
  transition: 'transform 0.2s ease-in-out',
  '&:hover': {
    transform: 'scale(1.02)',
  },
  padding: '16px',
  position: 'relative',
}));

export const RecipeImage = styled('img')({
  width: '100%',
  height: '200px',
  borderRadius: '12px',
  padding: '8px',
});

export const PlaceholderImage = styled(Box)({
  width: '100%',
  height: '200px',
  borderRadius: '12px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  backgroundColor: '#e0e0e0',
  color: '#888',
  padding: '12px',
  marginBottom: '8px',
});

export const DescriptionContainer = styled(Box)(() => ({
  backgroundColor: '#bbdf1981',
  borderRadius: '8px',
  padding: '8px',
  marginTop: '8px',
}));
