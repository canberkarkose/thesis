/* eslint-disable consistent-return */
/* eslint-disable no-plusplus */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';
import { Box, CircularProgress, Typography } from '@mui/material';

import { NutritionStats } from '@components/molecules/NutritionStats/NutritionStats';
import { GroceryTable } from '@components/organisms/GroceryTable/GroceryTable';
import { MealCalendar } from '@components/organisms/MealCalendar/MealCalendar';
import { RecipeInformationModal } from '@components/molecules/RecipeInformationModal/RecipeInformationModal';

interface DashboardPresentationProps {
  isLoading: boolean;
  userData: any;
  nutritionRecipesData: any[];
  loadingNutritionData: boolean;
  setIsWeeklyNutritionView: (isWeekly: boolean) => void;
  groupedIngredients: { [key: string]: any[] };
  loadingGroceryData: boolean;
  isWeeklyGroceryView: boolean;
  setIsWeeklyGroceryView: (isWeekly: boolean) => void;
  onSeeMore: (recipeId: number) => void;
  selectedRecipeInfo: any;
  isModalOpen: boolean;
  isModalLoading: boolean;
  onCloseModal: () => void;
}

export const DashboardPresentation: React.FC<DashboardPresentationProps> = ({
  isLoading,
  userData,
  nutritionRecipesData,
  loadingNutritionData,
  setIsWeeklyNutritionView,
  groupedIngredients,
  loadingGroceryData,
  isWeeklyGroceryView,
  setIsWeeklyGroceryView,
  onSeeMore,
  selectedRecipeInfo,
  isModalOpen,
  isModalLoading,
  onCloseModal
}) => {
  if (isLoading) {
    return (
      <Box
        display='flex'
        justifyContent='center'
        alignItems='center'
        height='100%'
        sx={{
          mt: '30%',
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box
      sx={{
        display: 'flex',
        padding: '16px',
        gap: '16px',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
      }}
    >
      <Box sx={{ flex: '1 1 100%' }}>
        <Typography variant='h3' sx={{ fontWeight: 'bold' }}>
          Welcome,
          {' '}
          {userData?.username}
        </Typography>
      </Box>

      {/* Nutrition Stats */}
      <Box sx={{
        flex: '1 1 40%',
      }}
      >
        <NutritionStats
          recipesData={nutritionRecipesData}
          loading={loadingNutritionData}
          setIsWeeklyView={setIsWeeklyNutritionView}
        />
      </Box>

      {/* Grocery Table */}
      <Box sx={{ flex: '1 1 35%' }}>
        <GroceryTable
          groupedIngredients={groupedIngredients}
          loading={loadingGroceryData}
          showControls
          isWeeklyView={isWeeklyGroceryView}
          setIsWeeklyView={setIsWeeklyGroceryView}
        />
      </Box>
      <Box sx={{ flex: '1 1 100%' }}>
        <MealCalendar isDashboard onSeeMore={onSeeMore} />
      </Box>
      <RecipeInformationModal
        open={isModalOpen}
        onClose={onCloseModal}
        isLoading={isModalLoading}
        recipeInfo={selectedRecipeInfo}
      />
    </Box>
  );
};
