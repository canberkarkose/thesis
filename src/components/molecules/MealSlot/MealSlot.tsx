/* eslint-disable no-nested-ternary */
/* eslint-disable import/no-cycle */
import { IconButton, Tooltip } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline'; // Use a '-' icon

import {
  StyledMealSlot,
  SlotBanner,
  RecipeImage,
  RecipeTitleContainer,
  EmptySlotText,
} from './MealSlot.styles';

import { Recipe } from '@components/organisms/MealCalendar/MealCalendar';

interface MealSlot {
  label: string;
  recipe?: Recipe;
}

interface MealSlotProps {
  slot: MealSlot;
  index: number;
  date: string;
  isDaily: boolean;
  isAddable: boolean;
  slotOpacity: number;
  recipeToAdd: Recipe | null;
  handleSlotClick: (index: number, date: string) => void;
  onSeeMore: (recipeId: number) => void;
  editMode: boolean;
  handleDeleteClick: (index: number, date: string) => void;
}

export const MealSlot = ({
  slot,
  index,
  date,
  isDaily,
  isAddable,
  slotOpacity,
  recipeToAdd,
  handleSlotClick,
  onSeeMore,
  editMode,
  handleDeleteClick,
}: MealSlotProps) => (
  <Tooltip
    key={slot.label}
    title={slot.recipe && !isDaily ? slot.recipe.title : ''}
    arrow
    disableInteractive
  >
    <StyledMealSlot
      key={slot.label}
      isDaily={isDaily}
      editMode={editMode}
      hasRecipe={!!slot.recipe}
      sx={{
        opacity: slotOpacity,
        cursor: (slot.recipe && !editMode && !recipeToAdd) ? 'pointer' : 'default',
        '&:hover': {
          transform: (slot.recipe && !editMode && !recipeToAdd) ? 'scale(1.05)' : 'none',
        },
      }}
      onClick={
        slot.recipe && !editMode && !recipeToAdd
          ? () => onSeeMore(slot.recipe!.id)
          : undefined
      }
    >
      <SlotBanner isDaily={isDaily}>{slot.label}</SlotBanner>
      {slot.recipe ? (
        <>
          {isDaily && (
            <RecipeTitleContainer>{slot.recipe.title}</RecipeTitleContainer>
          )}
          <RecipeImage
            src={slot.recipe.image}
            alt={slot.recipe.title}
            isDaily={isDaily}
          />
          {editMode && (
            <IconButton
              onClick={() => handleDeleteClick(index, date)}
              sx={{
                color: 'red',
                position: 'absolute',
                top: '8px',
                right: '8px',
                backgroundColor: 'rgba(255,255,255,0.8)',
                '&:hover': {
                  backgroundColor: 'rgba(255,255,255,1)',
                },
                zIndex: 3,
              }}
            >
              <RemoveCircleOutlineIcon />
            </IconButton>
          )}
        </>
      ) : recipeToAdd && isAddable ? (
        <IconButton onClick={() => isAddable && handleSlotClick(index, date)}>
          <AddIcon />
        </IconButton>
      ) : (
        <EmptySlotText>Empty</EmptySlotText>
      )}
    </StyledMealSlot>
  </Tooltip>
);
