import styled from '@emotion/styled';
import { Box, Typography } from '@mui/material';

export const StyledMealSlot = styled(Box)<{
  isDaily: boolean;
  editMode: boolean;
  hasRecipe: boolean;
}>`
  display: flex;
  position: relative;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  border: 1px solid #ddd;
  border-radius: 8px;
  width: ${({ isDaily }) => (isDaily ? '250px' : '130px')};
  height: ${({ isDaily }) => (isDaily ? '350px' : '115px')};
  max-width: ${({ isDaily }) => (isDaily ? '250px' : '130px')};
  text-align: center;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  overflow: hidden;

  ${({ editMode, hasRecipe }) => editMode
    && hasRecipe
    && `
    animation: shake 0.5s infinite;
  `}

  @keyframes shake {
    0% { transform: translateX(0); }
    25% { transform: translateX(-1px); }
    50% { transform: translateX(1px); }
    75% { transform: translateX(-1px); }
    100% { transform: translateX(0); }
  }
`;

export const EmptySlotText = styled(Typography)`
  color: #b0b0b0;
  font-size: 0.875rem;
`;

export const SlotBanner = styled(Box)<{ isDaily: boolean }>`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  background-color: rgba(0, 0, 0, 0.6);
  color: white;
  font-weight: bold;
  text-align: center;
  padding: ${({ isDaily }) => (isDaily ? '8px' : '2px')};
  font-size: ${({ isDaily }) => (isDaily ? '1rem' : '0.75rem')};
  border-top-left-radius: 8px;
  border-top-right-radius: 8px;
  z-index: 2;
`;

export const RecipeImage = styled('img')<{ isDaily: boolean }>`
  width: 100%;
  height: ${({ isDaily }) => (isDaily ? '60%' : '100%')};
  object-fit: cover;
  border-radius: ${({ isDaily }) => (!isDaily ? '8px' : '0')};
  bottom: ${({ isDaily }) => (isDaily ? '0' : 'auto')};
  ${({ isDaily }) => isDaily
    && `
    margin-top: auto;
  `}
`;

export const RecipeTitleContainer = styled(Box)`
  flex: 1;
  padding: 0 8px;
  margin-top: 72px;
  margin-bottom: 8px;
  text-align: center;
  font-weight: bold;
  font-size: 1rem;
  overflow: hidden;

  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;

  display: flex;
  flex-direction: column;
  max-height: 2.4em;
  line-height: 1.2em;
`;
