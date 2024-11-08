import { useEffect, useRef, useState } from 'react';
import { Box, CircularProgress } from '@mui/material';

import { RecipeCard } from '@components/molecules/RecipeCard/RecipeCard';
import { fetchRandomRecipes } from '@src/services/spoonacular-service';
import { ErrorPage } from '@components/pages/ErrorPage/ErrorPage';

interface Recipe {
  id: number;
  title: string;
  image: string;
  summary: string;
}

export const Recipes = () => {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const hasFetched = useRef(false);

  useEffect(() => {
    if (!hasFetched.current) {
      const loadRecipes = async () => {
        try {
          const data = await fetchRandomRecipes({ numberOfRecipes: 24 });
          setRecipes(data.recipes);
        } catch (err) {
          setError('Failed to load recipes. Please try again later.');
          console.error(err);
        } finally {
          hasFetched.current = true;
          setIsLoading(false);
        }
      };
      loadRecipes();
    }
  }, []);

  if (isLoading) {
    return (
      <Box display='flex' justifyContent='center' alignItems='center' mt='20%'>
        <CircularProgress sx={{ color: '#3C4C3D' }} size={100} />
      </Box>
    );
  }

  // TODO: THIS IS TEMPORARY REMOVE ERRORPAGE AND USE SOMETHING ELSE
  if (error) {
    return (
      <ErrorPage errorMessage={error} isAuthenticated />
    );
  }

  return (
    <Box display='flex' flexWrap='wrap' justifyContent='center'>
      {recipes.map((recipe) => (
        <RecipeCard
          key={recipe.id}
          image={recipe.image || ''}
          title={recipe.title}
          description={recipe.summary}
        />
      ))}
    </Box>
  );
};
