import { useState } from 'react';

import { Box, CircularProgress } from '@mui/material';

import { LandingPageDemoPresentation } from './LandingPageDemoPresentation';
import { ManualDemo } from './DemoTypes/ManualDemo';
import { QuizDemo } from './DemoTypes/QuizDemo';
import { DemoResults } from './DemoTypes/DemoResults';

import { fetchRecipes } from '@src/services/spoonacular-service';

export const LandingPageDemo = () => {
  const [currentDemoStep, setCurrentDemoStep] = useState<'start' | 'manual' | 'quiz' | 'results'>('start');
  const [recipes, setRecipes] = useState<{ id: number; title: string; image: string }[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleDemoOptionSelect = (option: 'manual' | 'quiz') => {
    setCurrentDemoStep(option);
  };

  const handleBackToStart = () => {
    setCurrentDemoStep('start');
  };

  const handleGenerateMeals = async (
    diet: string,
    intolerances: string[],
    cuisines: string[],
    excludeCuisines?: string[]
  ) => {
    setIsLoading(true);
    try {
      const res = await fetchRecipes({
        diet: diet === 'anything' ? undefined : diet,
        intolerances: intolerances.length > 0 ? intolerances.join(',') : undefined,
        cuisines: cuisines.length > 0 ? cuisines.join(',') : undefined,
        excludeCuisines: excludeCuisines && excludeCuisines.length > 0 ? excludeCuisines?.join(',') : undefined
      });

      // Randomly select 2 recipes
      const selectedRecipes = res.results.sort(() => 0.5 - Math.random()).slice(0, 2);
      setRecipes(selectedRecipes);
      setCurrentDemoStep('results');
    } catch (error) {
      console.error('Error fetching recipes:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {currentDemoStep === 'start' && (
        <LandingPageDemoPresentation onSelectDemo={handleDemoOptionSelect} />
      )}
      {currentDemoStep === 'manual' && (
        <ManualDemo onBack={handleBackToStart} onGenerateMeals={handleGenerateMeals} />
      )}
      {currentDemoStep === 'quiz' && (
        <QuizDemo onBack={handleBackToStart} onGenerateMeals={handleGenerateMeals} />
      )}
      {currentDemoStep === 'results' && (
        isLoading ? (
          <Box display='flex' justifyContent='center' alignItems='center' minHeight='100vh'>
            <CircularProgress />
          </Box>
        ) : (
          <DemoResults recipes={recipes} onBack={handleBackToStart} />
        )
      )}
    </>
  );
};
