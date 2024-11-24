// ModalHeader.tsx

import React, { useState } from 'react';
import {
  Box, IconButton, Tooltip, Menu, MenuItem
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';

import { Title } from './RecipeInformationModal.styles';

interface ModalHeaderProps {
  onClose: () => void;
  title: string;
  isLiked: boolean;
  handleLikeToggle: () => void;
  mealTypeOptions?: string[];
  onMealTypeSelect?: (mealType: string) => void;
}

export const ModalHeader: React.FC<ModalHeaderProps> = ({
  onClose,
  title,
  isLiked,
  handleLikeToggle,
  mealTypeOptions = [],
  onMealTypeSelect,
}) => {
  const [mealTypeMenuAnchorEl, setMealTypeMenuAnchorEl] = useState<null | HTMLElement>(null);

  const handleCalendarIconClick = (event: React.MouseEvent<HTMLElement>) => {
    setMealTypeMenuAnchorEl(event.currentTarget);
  };

  const handleMealTypeMenuClose = () => {
    setMealTypeMenuAnchorEl(null);
  };

  const handleMealTypeClick = (mealType: string) => {
    handleMealTypeMenuClose();
    if (onMealTypeSelect) {
      onMealTypeSelect(mealType);
    }
  };

  return (
    <>
      <IconButton onClick={onClose} sx={{ position: 'absolute', top: 8, right: 8 }}>
        <CloseIcon />
      </IconButton>
      <Box
        sx={{
          position: 'absolute',
          top: 25,
          right: 150,
          backgroundColor: 'white',
          borderRadius: '8px',
          boxShadow: 3,
        }}
      >
        <Tooltip title='Add to meal plan' arrow disableInteractive>
          <IconButton onClick={handleCalendarIconClick}>
            <CalendarMonthIcon />
          </IconButton>
        </Tooltip>
        <Menu
          anchorEl={mealTypeMenuAnchorEl}
          open={Boolean(mealTypeMenuAnchorEl)}
          onClose={handleMealTypeMenuClose}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
          transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        >
          {mealTypeOptions.map((mealType) => (
            <MenuItem key={mealType} onClick={() => handleMealTypeClick(mealType)}>
              Add to
              {' '}
              {mealType}
            </MenuItem>
          ))}
        </Menu>
      </Box>
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
        <Title variant='h5' sx={{ wordBreak: 'break-word', mx: 20 }}>{title}</Title>
      </Box>
    </>
  );
};
