/* eslint-disable no-nested-ternary */
/* eslint-disable no-plusplus */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Box, Typography } from '@mui/material';

import { useRef, useState } from 'react';

import { Container, GeneratedMealsContainer } from './MealPlanner.styles';

import { renderPaginationButtons } from './MealPlanner.helper';

import { RecipeCard } from '@components/molecules/RecipeCard/RecipeCard';

import { MealGenerator, paramsType } from '@components/molecules/MealGenerator/MealGenerator';
import { RecipeInformationModal } from '@components/molecules/RecipeInformationModal/RecipeInformationModal';
import { MealCalendar } from '@components/organisms/MealCalendar/MealCalendar';

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
  type: string;
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
  onCloseModal,
  type
}: MealPlannerPresentationProps) => {
  const mealCalendarRef = useRef<HTMLDivElement>(null);
  const generatedMealsRef = useRef<HTMLDivElement>(null);
  const [toggleStates, setToggleStates] = useState<{ [key: number]: boolean }>({});
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);

  const resetSelectedRecipe = () => {
    setSelectedRecipe(null);
  };

  const handleToggleAddButton = (recipe: Recipe) => {
    setToggleStates((prevStates) => {
      const newState = { ...prevStates };
      if (newState[recipe.id]) {
        delete newState[recipe.id];
        resetSelectedRecipe();
      } else {
        // eslint-disable-next-line no-return-assign
        Object.keys(newState).forEach((key) => (newState[Number(key)] = false));
        newState[recipe.id] = true;
        setSelectedRecipe(recipe);
      }
      return newState;
    });
    if (!toggleStates[recipe.id]) {
      mealCalendarRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleRecipeAdded = () => {
    if (selectedRecipe) {
      setToggleStates((prevStates) => {
        const newState = { ...prevStates };
        delete newState[selectedRecipe.id];
        return newState;
      });
      resetSelectedRecipe();
    }
  };

  return (
    <Container>
      <MealGenerator
        onGenerate={handleGenerateMeals}
        isLoading={isLoading}
        resetSelectedRecipe={resetSelectedRecipe}
      />
      <Box mt={4} ref={generatedMealsRef}>
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
                    minWidth: '250px',
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
                    onAddToMealPlan={() => handleToggleAddButton(meal)}
                    isAddButtonDisabled={!!selectedRecipe && selectedRecipe.id !== meal.id}
                    isActive={!!toggleStates[meal.id]}
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
      <div
        ref={mealCalendarRef}
        style={{
          scrollMarginTop: '55px',
        }}
      >
        <MealCalendar
          recipeToAdd={selectedRecipe}
          onRecipeAdded={handleRecipeAdded}
          type={type}
          onSeeMore={onSeeMore}
        />
      </div>
      <RecipeInformationModal
        open={isModalOpen}
        onClose={onCloseModal}
        isLoading={isModalLoading}
        recipeInfo={selectedRecipeInfo}
      />
    </Container>
  );
};
