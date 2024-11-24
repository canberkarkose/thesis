import React from 'react';
import { Box, IconButton, Tooltip } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';

import { Title } from './RecipeInformationModal.styles';

interface ModalHeaderProps {
  onClose: () => void;
  title: string;
  isLiked: boolean;
  handleLikeToggle: () => void;
}

export const ModalHeader: React.FC<ModalHeaderProps> = ({
  onClose,
  title,
  isLiked,
  handleLikeToggle,
}) => (
  <>
    <IconButton onClick={onClose} sx={{ position: 'absolute', top: 8, right: 8 }}>
      <CloseIcon />
    </IconButton>
    <Box
      sx={{
        position: 'absolute',
        top: 25,
        right: 100,
        backgroundColor: 'white',
        borderRadius: '8px',
        boxShadow: 3,
      }}
    >
      <Tooltip title={isLiked ? 'Unlike' : 'Like'} arrow disableInteractive>
        <IconButton onClick={handleLikeToggle}>
          {isLiked ? <FavoriteIcon sx={{ color: 'red' }} /> : <FavoriteBorderIcon />}
        </IconButton>
      </Tooltip>
    </Box>
    <Box sx={{ mb: 1 }}>
      <Title variant='h5'>{title}</Title>
    </Box>
  </>
);
