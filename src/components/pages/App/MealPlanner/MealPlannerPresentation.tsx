/* eslint-disable no-plusplus */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Box, Typography } from '@mui/material';

import { Container, GeneratedMealsContainer } from './MealPlanner.styles';

import { renderPaginationButtons } from './MealPlanner.helper';

import { RecipeCard } from '@components/molecules/RecipeCard/RecipeCard';

import { MealGenerator, paramsType } from '@components/molecules/MealGenerator/MealGenerator';

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
}

export const MealPlannerPresentation = ({
  handleGenerateMeals,
  selectedMeals,
  isLoading,
  apiError,
  currentPage,
  totalPages,
  onPageChange,
}: MealPlannerPresentationProps) => (
  <Container>
    <MealGenerator onGenerate={handleGenerateMeals} isLoading={isLoading} />
    <Box mt={4}>
      <Typography variant='h5' gutterBottom align='center'>
        Generated Meals
      </Typography>
      {apiError && (
      <Typography variant='body1' color='error' align='center'>
        {apiError}
      </Typography>
      )}
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
                  onSeeMore={() => { }}
                />
              ))}
            </Box>
            <Box display='flex' justifyContent='center' mt={2} gap={1}>
              {renderPaginationButtons({ currentPage, totalPages, onPageChange })}
            </Box>
          </>
        ) : (
          <Typography variant='body1' align='center'>
            No meals generated yet.
          </Typography>
        )}
      </GeneratedMealsContainer>
    </Box>
  </Container>
);
