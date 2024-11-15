/* eslint-disable no-nested-ternary */
/* eslint-disable no-plusplus */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Box, Typography } from '@mui/material';

import { Container, GeneratedMealsContainer } from './MealPlanner.styles';

import { renderPaginationButtons } from './MealPlanner.helper';

import { RecipeCard } from '@components/molecules/RecipeCard/RecipeCard';

import { MealGenerator, paramsType } from '@components/molecules/MealGenerator/MealGenerator';
import { RecipeInformationModal } from '@components/molecules/RecipeInformationModal/RecipeInformationModal';
import { MealCalendar } from '@components/molecules/MealCalendar/MealCalendar';

interface Recipe {
  id: number;
  title: string;
  image?: string;
}

interface MealPlannerPresentationProps {
  handleGenerateMeals: (params: paramsType) => void;
  selectedMeals: Recipe[];
  isLoading: boolean;
  apiError: string | null;
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  onSeeMore: (recipeId: number) => void;
  selectedRecipeInfo: any;
  isModalOpen: boolean;
  isModalLoading: boolean;
  onCloseModal: () => void;
}

export const MealPlannerPresentation = ({
  handleGenerateMeals,
  selectedMeals,
  isLoading,
  apiError,
  currentPage,
  totalPages,
  onPageChange,
  onSeeMore,
  selectedRecipeInfo,
  isModalOpen,
  isModalLoading,
  onCloseModal
}: MealPlannerPresentationProps) => (
  <Container>
    <MealGenerator onGenerate={handleGenerateMeals} isLoading={isLoading} />
    <Box mt={4}>
      <Typography variant='h5' gutterBottom align='center'>
        Your Generated Meals
      </Typography>
      <GeneratedMealsContainer>
        {selectedMeals.length > 0 ? (
          <>
            <Box
              display='flex'
              justifyContent='center'
              flexWrap='wrap'
              gap={2}
              sx={{
                '& > *': {
                  width: '100%',
                  maxWidth: '250px',
                },
              }}
            >
              {selectedMeals.map((meal) => (
                <RecipeCard
                  key={meal.id}
                  image={meal.image}
                  title={meal.title}
                  onSeeMore={() => onSeeMore(meal.id)}
                  showAddButton
                />
              ))}
            </Box>
            <Box display='flex' justifyContent='center' mt={2} gap={1}>
              {renderPaginationButtons({ currentPage, totalPages, onPageChange })}
            </Box>
          </>
        ) : (
          apiError ? (
            <Typography variant='body1' align='center' sx={{ color: 'red' }}>
              {apiError}
            </Typography>
          ) : (
            <Typography variant='body1' align='center'>
              No meals generated yet.
            </Typography>
          )
        )}
      </GeneratedMealsContainer>
    </Box>
    <MealCalendar />
    <RecipeInformationModal
      open={isModalOpen}
      onClose={onCloseModal}
      isLoading={isModalLoading}
      recipeInfo={selectedRecipeInfo}
    />
  </Container>
);
