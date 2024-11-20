/* eslint-disable no-mixed-operators */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from 'react';
import {
  Box, Typography, Button, CircularProgress, Tabs, Tab,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import HighchartsReact from 'highcharts-react-official';
import Highcharts from 'highcharts';

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
            maxWidth: 500,
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
      sx={{
        width: '48%',
        height: '500px',
        padding: '16px',
        borderRadius: '8px',
        background: 'rgba(255, 255, 255, 0.8)',
        boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)',
        display: 'flex',
        flexDirection: 'column',
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
          Nutrition Stats
        </Typography>
        {/* Tabs */}
        <Tabs
          value={isWeekly ? 'weekly' : 'daily'}
          onChange={handleTabChange}
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
        sx={{
          flexGrow: 1,
          border: '1px solid rgba(0, 0, 0, 0.1)',
          borderRadius: '8px',
          padding: '16px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        {loading && <CircularProgress sx={{ mt: '150px' }} />}
        {!loading && !hasRecipes && (
          <Box sx={{ textAlign: 'center', marginTop: '125px' }}>
            <Typography variant='body1' sx={{ marginBottom: '16px' }}>
              {isWeekly ? 'No recipes planned for this week.' : 'No recipes planned for today.'}
            </Typography>
            <Button variant='contained' color='primary' onClick={() => navigate('/app/meal-planner')}>
              Go to Meal Planner
            </Button>
          </Box>
        )}
        {!loading && hasRecipes && (
          <>
            {/* Total Calories */}
            <Typography
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
            <HighchartsReact highcharts={Highcharts} options={chartOptions} />
          </>
        )}
      </Box>
    </Box>
  );
};
