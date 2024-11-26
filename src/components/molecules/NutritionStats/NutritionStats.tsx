/* eslint-disable no-mixed-operators */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from 'react';
import {
  Box, Typography, Button, CircularProgress, Tabs, Tab,
  useTheme,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import HighchartsReact from 'highcharts-react-official';
import Highcharts from 'highcharts';

import { dataTestIds } from '../../../dataTest/dataTestIds';

interface NutritionStatsProps {
  recipesData: any[];
  loading: boolean;
  setIsWeeklyView: (isWeekly: boolean) => void;
}

const calculateAverages = (recipesData: any[]) => {
  let totalCalories = 0;
  let totalProtein = 0;
  let totalCarbs = 0;
  let totalFats = 0;

  recipesData.forEach((recipe) => {
    const nutrients = recipe?.nutrition?.nutrients || [];
    const caloricBreakdown = recipe?.nutrition?.caloricBreakdown || {};

    const caloriesInfo = nutrients.find((nutrient: any) => nutrient.name === 'Calories');
    totalCalories += caloriesInfo?.amount || 0;

    totalProtein += caloricBreakdown.percentProtein || 0;
    totalCarbs += caloricBreakdown.percentCarbs || 0;
    totalFats += caloricBreakdown.percentFat || 0;
  });

  const recipeCount = recipesData.length || 1;
  return {
    averageCalories: totalCalories / recipeCount,
    averageProtein: totalProtein / recipeCount,
    averageCarbs: totalCarbs / recipeCount,
    averageFats: totalFats / recipeCount,
  };
};

export const NutritionStats = ({ recipesData, loading, setIsWeeklyView }: NutritionStatsProps) => {
  const theme = useTheme();
  const navigate = useNavigate();
  const hasRecipes = recipesData && recipesData.length > 0;
  const [isWeekly, setWeekly] = useState(true);

  const handleTabChange = (_event: React.SyntheticEvent, newValue: string) => {
    const isWeeklyView = newValue === 'weekly';
    setWeekly(isWeeklyView);
    setIsWeeklyView(isWeeklyView);
  };

  const {
    averageCalories, averageProtein, averageCarbs, averageFats
  } = calculateAverages(recipesData);

  const totalCaloriesFromMacros = (averageProtein * 4) + (averageCarbs * 4) + (averageFats * 9);

  const chartOptions = {
    chart: {
      type: 'column',
      height: '300px',
    },
    credits: {
      enabled: false
    },
    title: {
      text: '',
    },
    xAxis: {
      categories: ['Protein', 'Carbs', 'Fats'],
    },
    yAxis: {
      min: 0,
      title: {
        text: 'Percentage',
      },
    },
    plotOptions: {
      column: {
        dataLabels: {
          enabled: true, // Show data labels
          format: '{point.y:.2f}%', // Display value with 2 decimal points
        },
      },
    },
    series: [
      {
        name: 'Macronutrients Distribution',
        data: [
          Number(averageProtein.toFixed(2)),
          Number(averageCarbs.toFixed(2)),
          Number(averageFats.toFixed(2)),
        ],
      },
      {
        name: 'Calories Contribution',
        data: [
          Number(((averageProtein * 4) / totalCaloriesFromMacros * 100).toFixed(2)),
          Number(((averageCarbs * 4) / totalCaloriesFromMacros * 100).toFixed(2)),
          Number(((averageFats * 9) / totalCaloriesFromMacros * 100).toFixed(2)),
        ],
      },
    ],
    responsive: {
      rules: [
        {
          condition: {
            maxWidth: 200,
          },
          chartOptions: {
            legend: {
              enabled: false,
            },
          },
        },
      ],
    },
  };

  return (
    <Box
      data-testid={dataTestIds.components.nutritionStats.container}
      sx={{
        height: '500px',
        padding: '16px',
        borderRadius: '8px',
        background: 'rgba(255, 255, 255, 0.8)',
        boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)',
        display: 'flex',
        flexDirection: 'column',
        marginTop: theme.spacing(2),
      }}
    >
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '16px',
        }}
      >
        {/* Title */}
        <Typography variant='h6' sx={{ fontWeight: 'bold' }}>
          Your Nutrition Stats
        </Typography>
        {/* Tabs */}
        <Tabs
          value={isWeekly ? 'weekly' : 'daily'}
          onChange={handleTabChange}
          data-testid={dataTestIds.components.nutritionStats.tabs}
          sx={{
            minHeight: '18px',
            '& .MuiTabs-flexContainer': {
              justifyContent: 'flex-end', // Align tabs to the right
            },
            '& .MuiTabs-indicator': {
              display: 'none',
            },
          }}
        >
          <Tab
            label='Daily'
            value='daily'
            disabled={loading}
            data-testid={dataTestIds.components.nutritionStats.dailyTab}
            sx={{
              textTransform: 'none',
              fontWeight: 'bold',
              borderRadius: '18px',
              marginRight: '8px',
              border: '1px solid rgba(0, 0, 0, 0.2)',
              '&.Mui-selected': {
                backgroundColor: '#5b9d3e',
                color: 'white',
              },
            }}
          />
          <Tab
            label='Weekly'
            value='weekly'
            disabled={loading}
            data-testid={dataTestIds.components.nutritionStats.weeklyTab}
            sx={{
              textTransform: 'none',
              fontWeight: 'bold',
              borderRadius: '18px',
              border: '1px solid rgba(0, 0, 0, 0.2)',
              '&.Mui-selected': {
                backgroundColor: '#5b9d3e',
                color: 'white',
              },
            }}
          />
        </Tabs>
      </Box>
      {/* Content */}
      <Box
        data-testid={dataTestIds.components.nutritionStats.content}
        sx={{
          flexGrow: 1,
          border: hasRecipes ? '1px solid rgba(0, 0, 0, 0.1)' : 'none',
          borderRadius: '8px',
          padding: '16px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        {loading && <CircularProgress data-testid={dataTestIds.components.nutritionStats.loadingIndicator} sx={{ mt: '150px' }} />}
        {!loading && !hasRecipes && (
          <Box data-testid={dataTestIds.components.nutritionStats.noData} sx={{ textAlign: 'center', marginTop: '19%' }}>
            <Typography variant='h4' gutterBottom>
              No nutrition data available
            </Typography>
            <Typography variant='body1' gutterBottom>
              You don&apos;t have any meals planned for
              {' '}
              {isWeekly ? 'this week' : 'today'}
              .
            </Typography>
            <Button
              variant='contained'
              onClick={() => {
                navigate('/app/meal-planner');
              }}
              data-testid={dataTestIds.components.nutritionStats.goToMealPlannerButton}
              sx={{
                mt: 2,
                color: 'white',
                backgroundColor: '#5c9c3e',
                '&:hover': {
                  backgroundColor: '#406d2b',
                },
              }}
            >
              Go to Meal Planner
            </Button>
          </Box>
        )}
        {!loading && hasRecipes && (
          <>
            {/* Total Calories */}
            <Typography
              data-testid={dataTestIds.components.nutritionStats.averageCalories}
              variant='h6'
              sx={{
                fontWeight: 'bold',
                marginBottom: '16px',
                color: '#5b9d3e',
              }}
            >
              Average Calorie Per Meal:
              {' '}
              {averageCalories.toFixed(1)}
              {' '}
              kcal
            </Typography>
            {/* Highchart */}
            <div data-testid={dataTestIds.components.nutritionStats.chart}>
              <HighchartsReact
                highcharts={Highcharts}
                options={chartOptions}
              />
            </div>
          </>
        )}
      </Box>
    </Box>
  );
};
