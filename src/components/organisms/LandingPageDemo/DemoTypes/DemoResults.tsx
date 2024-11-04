import {
  Box, Button, Tooltip, Typography
} from '@mui/material';

import { useNavigate } from 'react-router-dom';

import { DemoContentWrapper } from '../templates/DemoContentWrapper';

import { Space } from '@components/atoms/Space/Space';

interface DemoResultsProps {
  recipes: { id: number; title: string; image: string }[];
  onBack: () => void;
}

export const DemoResults = ({ recipes, onBack }: DemoResultsProps) => {
  const navigate = useNavigate();
  return (
    <DemoContentWrapper
      headline='Your Generated Meals'
      subheading='Here are some meal ideas based on your selections!'
    >
      <Space s24 />
      <Box display='flex' justifyContent='space-between' flexWrap='wrap' gap={2}>
        {recipes.map((recipe) => (
          <Box
            key={recipe.id}
            textAlign='center'
            maxWidth='300px'
            maxHeight='250px'
            overflow='hidden'
          >
            <img
              src={recipe.image}
              alt={recipe.title}
              style={{ width: '100%', borderRadius: '8px' }}
            />
            <Tooltip title={recipe.title} arrow>
              <Typography
                variant='subtitle1'
                gutterBottom
                sx={{
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  maxWidth: '100%',
                }}
              >
                {recipe.title}
              </Typography>
            </Tooltip>
          </Box>
        ))}
      </Box>
      <Space s32 />
      <Box textAlign='center'>
        <Typography variant='h6'>
          Want to generate more meals and see detailed recipes?
        </Typography>
        <Typography variant='body2' marginBottom='16px'>
          Sign up now to unlock full access and take your meal planning to the next level!
        </Typography>
        <Box display='flex' justifyContent='center' gap='16px'>
          <Button variant='contained' color='primary' onClick={() => navigate('/register')}>
            Sign Up
          </Button>
          <Button
            variant='outlined'
            sx={{
              backgroundColor: '#D67333',
              '&:hover': {
                backgroundColor: '#84441b'
              }
            }}
            onClick={onBack}
          >
            Back
          </Button>
        </Box>
      </Box>
    </DemoContentWrapper>
  );
};
