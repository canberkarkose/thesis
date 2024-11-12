/* eslint-disable @typescript-eslint/no-unused-vars */
import { useEffect, useState } from 'react';
import { Box, Button, CircularProgress } from '@mui/material';

import { Recipe, RecipeInformation } from './Recipes.types';

import { RecipeCard } from '@components/molecules/RecipeCard/RecipeCard';
import { fetchRandomRecipes, fetchRecipeInformation } from '@src/services/spoonacular-service';
import { ErrorPage } from '@components/pages/ErrorPage/ErrorPage';
import { RecipeInformationModal } from '@components/molecules/RecipeInformationModal/RecipeInformationModal';

const MAX_RECIPES = 150;

export const Recipes = () => {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isLoadMoreLoading, setIsLoadMoreLoading] = useState(false);
  const [recipeIds, setRecipeIds] = useState<Set<number>>(new Set());
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModalLoading, setIsModalLoading] = useState(false);
  const [selectedRecipeInfo, setSelectedRecipeInfo] = useState<RecipeInformation | null>(null);

  useEffect(() => {
    const loadRecipes = async () => {
      try {
        setIsLoading(true);
        const data = await fetchRandomRecipes({ numberOfRecipes: 30 });
        const uniqueRecipes = data.recipes.filter((recipe: Recipe) => !recipeIds.has(recipe.id));
        setRecipes(uniqueRecipes);
        setRecipeIds(new Set(uniqueRecipes.map((recipe: Recipe) => recipe.id)));
      } catch (err) {
        setError('Failed to load recipes. Please try again later.');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    loadRecipes();
  }, []);

  const loadMoreRecipes = async () => {
    if (recipes.length >= MAX_RECIPES) return;
    try {
      setIsLoadMoreLoading(true);
      let newRecipes: Recipe[] = [];
      while (newRecipes.length < 24 && recipes.length + newRecipes.length < MAX_RECIPES) {
        // eslint-disable-next-line no-await-in-loop
        const data = await fetchRandomRecipes({ numberOfRecipes: 24 });
        const uniqueNewRecipes = data.recipes.filter(
          (recipe: Recipe) => !recipeIds.has(recipe.id)
        );
        newRecipes = [...newRecipes, ...uniqueNewRecipes];
      }
      setRecipes((prevRecipes) => [...prevRecipes, ...newRecipes.slice(0, 24)]);
      setRecipeIds((prevIds) => {
        const updatedIds = new Set(prevIds);
        newRecipes.forEach((recipe) => updatedIds.add(recipe.id));
        return updatedIds;
      });
    } catch (err) {
      setError('Failed to load more recipes. Please try again later.');
      console.error(err);
    } finally {
      setIsLoadMoreLoading(false);
    }
  };

  const handleSeeMore = async (id: number) => {
    try {
      setIsModalLoading(true);
      setIsModalOpen(true);
      const data = await fetchRecipeInformation(id);
      setSelectedRecipeInfo(data);
    } catch (err) {
      console.error('Failed to fetch recipe information:', err);
      setError('Failed to fetch recipe information. Please try again later.');
    } finally {
      setIsModalLoading(false);
    }
  };

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
    <>
      <Box display='flex' flexDirection='column' alignItems='center'>
        <Box display='flex' flexWrap='wrap' justifyContent='center'>
          {recipes.map((recipe) => (
            <RecipeCard
              key={recipe.id}
              image={recipe.image || ''}
              title={recipe.title}
              description={recipe.summary}
              onSeeMore={() => handleSeeMore(recipe.id)}
            />
          ))}
        </Box>
        {recipes.length < MAX_RECIPES && (
        <Box mt={4}>
          {isLoadMoreLoading ? (
            <CircularProgress sx={{ color: '#3C4C3D' }} size={40} />
          ) : (
            <Button
              variant='contained'
              onClick={loadMoreRecipes}
              sx={{
                backgroundColor: '#3C4C3D',
                color: 'white',
                '&:hover': {
                  backgroundColor: '#283328'
                }
              }}
              size='large'
            >
              Load More
            </Button>
          )}
        </Box>
        )}
      </Box>
      <RecipeInformationModal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        isLoading={isModalLoading}
        recipeInfo={selectedRecipeInfo}
      />
    </>
  );
};
