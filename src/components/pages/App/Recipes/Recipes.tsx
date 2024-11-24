/* eslint-disable no-nested-ternary */
/* eslint-disable consistent-return */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { useEffect, useState } from 'react';
import {
  Box, Button, CircularProgress, Switch, Tooltip, Typography
} from '@mui/material';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';

import { doc, getDoc, onSnapshot } from 'firebase/firestore';

import { Recipe, RecipeInformation } from './Recipes.types';

import { db } from '@src/firebase-config';

import { RecipeCard } from '@components/molecules/RecipeCard/RecipeCard';
import {
  fetchRandomRecipes,
  fetchRecipeInformation,
  fetchRecipeInformationBulk,
} from '@src/services/spoonacular-service';
import { ErrorPage } from '@components/pages/ErrorPage/ErrorPage';
import { RecipeInformationModal } from '@components/molecules/RecipeInformationModal/RecipeInformationModal';

import { useAuth } from '@src/contexts/AuthContext';

const MAX_RECIPES = 150;

export const Recipes = () => {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [displayedLikedRecipes, setDisplayedLikedRecipes] = useState<Recipe[]>([]);
  const [likedRecipeIds, setLikedRecipeIds] = useState<number[]>([]);
  const [likedRecipesPage, setLikedRecipesPage] = useState(1);
  const [showLikedRecipes, setShowLikedRecipes] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isLoadMoreLoading, setIsLoadMoreLoading] = useState(false);
  const [recipeIds, setRecipeIds] = useState<Set<number>>(new Set());
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModalLoading, setIsModalLoading] = useState(false);
  const [selectedRecipeInfo, setSelectedRecipeInfo] = useState<RecipeInformation | null>(null);

  const { user } = useAuth();

  useEffect(() => {
    const loadRecipes = async () => {
      try {
        setIsLoading(true);
        if (showLikedRecipes) {
          if (!user) {
            setError('User not authenticated');
            return;
          }
          // Fetch liked recipe IDs from Firestore
          const userDocRef = doc(db, 'users', user.uid);
          const userDoc = await getDoc(userDocRef);
          if (userDoc.exists()) {
            const data = userDoc.data();
            const likedIds: number[] = data.likedRecipes || [];
            setLikedRecipeIds(likedIds);
            setLikedRecipesPage(1);
            if (likedIds.length === 0) {
              setDisplayedLikedRecipes([]);
            } else {
              // Fetch first 30 liked recipes
              const idsToFetch = likedIds.slice(0, 30);
              const recipeData = await fetchRecipeInformationBulk(idsToFetch);
              setDisplayedLikedRecipes(recipeData);
            }
          } else {
            setError('User document not found');
          }
        } else {
          // Reset recipes and recipeIds when switching back to random recipes
          setRecipes([]);
          setRecipeIds(new Set());
          // Fetch random recipes
          const data = await fetchRandomRecipes({ numberOfRecipes: 30 });
          setRecipes(data.recipes);
          setRecipeIds(new Set(data.recipes.map((recipe: Recipe) => recipe.id)));
        }
      } catch (err) {
        setError('Failed to load recipes. Please try again later.');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    loadRecipes();
  }, [showLikedRecipes]);

  useEffect(() => {
    if (showLikedRecipes && user) {
      const userDocRef = doc(db, 'users', user.uid);
      const unsubscribe = onSnapshot(userDocRef, async (docSnapshot) => {
        if (docSnapshot.exists()) {
          const data = docSnapshot.data();
          const likedIds: number[] = data.likedRecipes || [];
          setLikedRecipeIds(likedIds);
          setLikedRecipesPage(1);
          if (likedIds.length === 0) {
            setDisplayedLikedRecipes([]);
          } else {
            // Fetch first 30 liked recipes
            const idsToFetch = likedIds.slice(0, 30);
            try {
              const recipeData = await fetchRecipeInformationBulk(idsToFetch);
              setDisplayedLikedRecipes(recipeData);
            } catch (err) {
              console.error('Failed to fetch liked recipes:', err);
            }
          }
        } else {
          setError('User document not found');
        }
      });
      return () => unsubscribe();
    }
  }, [showLikedRecipes, user]);

  const loadMoreRecipes = async () => {
    if (showLikedRecipes) {
      // Liked recipes logic
      const nextPage = likedRecipesPage + 1;
      const startIndex = likedRecipesPage * 30;
      const endIndex = startIndex + 30;
      const idsToFetch = likedRecipeIds.slice(startIndex, endIndex);
      if (idsToFetch.length === 0) return;
      try {
        setIsLoadMoreLoading(true);
        const data = await fetchRecipeInformationBulk(idsToFetch);
        setDisplayedLikedRecipes((prevRecipes) => [...prevRecipes, ...data]);
        setLikedRecipesPage(nextPage);
      } catch (err) {
        setError('Failed to load more recipes. Please try again later.');
        console.error(err);
      } finally {
        setIsLoadMoreLoading(false);
      }
    } else {
      // Random recipes logic
      if (recipes.length >= MAX_RECIPES) return;
      try {
        setIsLoadMoreLoading(true);
        let newRecipes: Recipe[] = [];
        while (newRecipes.length < 30 && recipes.length + newRecipes.length < MAX_RECIPES) {
          // eslint-disable-next-line no-await-in-loop
          const data = await fetchRandomRecipes({ numberOfRecipes: 30 });
          const uniqueNewRecipes = data.recipes.filter(
            (recipe: Recipe) => !recipeIds.has(recipe.id)
          );
          newRecipes = [...newRecipes, ...uniqueNewRecipes];
          // Update recipeIds with new IDs
          uniqueNewRecipes.forEach((recipe: { id: number; }) => recipeIds.add(recipe.id));
        }
        setRecipes((prevRecipes) => [...prevRecipes, ...newRecipes.slice(0, 30)]);
        // Update recipeIds state
        setRecipeIds(new Set(recipeIds));
      } catch (err) {
        setError('Failed to load more recipes. Please try again later.');
        console.error(err);
      } finally {
        setIsLoadMoreLoading(false);
      }
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

  // Remove the early return of loading state

  // TODO: THIS IS TEMPORARY REMOVE ERRORPAGE AND USE SOMETHING ELSE
  if (error) {
    return <ErrorPage errorMessage={error} isAuthenticated />;
  }

  const recipesToDisplay = showLikedRecipes ? displayedLikedRecipes : recipes;
  const canLoadMore = showLikedRecipes
    ? likedRecipeIds.length > recipesToDisplay.length
    : recipes.length < MAX_RECIPES;

  const title = showLikedRecipes ? 'Your Liked Recipes' : 'Discover New Recipes';
  const subtitle = showLikedRecipes
    ? 'Here are the recipes you have liked.'
    : 'Explore a variety of random recipes.';

  return (
    <>
      <Box display='flex' flexDirection='column' alignItems='center'>
        <Box
          display='flex'
          alignItems='center'
          justifyContent='center'
          width='100%'
          mb={4}
          mt={4}
          position='relative'
        >
          <Box position='absolute' left='9%'>
            <Tooltip title={showLikedRecipes ? 'Show random recipes' : 'Show liked recipes'} arrow>
              <Switch
                checked={showLikedRecipes}
                onChange={(event) => setShowLikedRecipes(event.target.checked)}
                disabled={isLoading}
                icon={<FavoriteBorderIcon />}
                checkedIcon={<FavoriteIcon />}
                sx={{
                  '& .MuiSwitch-switchBase.Mui-checked': {
                    color: '#f50057',
                  },
                  '& .MuiSwitch-switchBase': {
                    color: '#3C4C3D',
                  },
                  transform: 'scale(1.5)',
                }}
              />
            </Tooltip>
          </Box>
          <Box textAlign='center'>
            <Typography variant='h4' component='h1' sx={{ fontWeight: 700 }}>
              {title}
            </Typography>
            <Typography variant='h6' component='h2' sx={{ color: 'gray' }}>
              {subtitle}
            </Typography>
          </Box>
        </Box>

        {isLoading ? (
          <Box display='flex' justifyContent='center' alignItems='center' mt='11%'>
            <CircularProgress sx={{ color: '#3C4C3D' }} size={60} />
          </Box>
        ) : recipesToDisplay.length === 0 && showLikedRecipes ? (
          <Box
            mt={20}
            textAlign='center'
            sx={{
              backgroundColor: 'rgba(235, 235, 235, 0.9)',
              borderRadius: '12px',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
              p: 4,
              mt: '11%'
            }}
          >
            <Typography variant='h5' component='h2' gutterBottom>
              You have no liked recipes yet.
            </Typography>
            <Typography variant='body1'>
              Start exploring and like some recipes to see them here!
            </Typography>
          </Box>
        ) : (
          <>
            <Box display='flex' flexWrap='wrap' justifyContent='center'>
              {recipesToDisplay.map((recipe) => (
                <RecipeCard
                  key={recipe.id}
                  image={recipe.image || ''}
                  title={recipe.title}
                  description={recipe.summary}
                  onSeeMore={() => handleSeeMore(recipe.id)}
                />
              ))}
            </Box>
            {canLoadMore && (
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
                        backgroundColor: '#283328',
                      },
                    }}
                    size='large'
                  >
                    Load More
                  </Button>
                )}
              </Box>
            )}
          </>
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
