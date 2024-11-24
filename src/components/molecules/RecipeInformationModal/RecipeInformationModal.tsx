import React, { useState, useEffect } from 'react';
import { Modal, Box, CircularProgress } from '@mui/material';
import Slide from '@mui/material/Slide';
import sanitizeHtml from 'sanitize-html';

import {
  arrayRemove, arrayUnion, doc, getDoc, updateDoc
} from 'firebase/firestore';
import { toast } from 'react-toastify';

import {
  ModalContent,
  ModalContainer,
  InfoRow,
  InfoItem,
} from './RecipeInformationModal.styles';

import { ModalHeader } from './ModalHeader';
import { RecipeImageSection } from './RecipeImageSection';
import { CaloricBreakdownChart } from './CaloricBreakdownChart';
import { RecipeInfoDetails } from './RecipeInfoDetails';
import { IngredientsList } from './IngredientsList';
import { InstructionsStepper } from './InstructionsStepper';

import { db } from '@src/firebase-config';
import { useAuth } from '@src/contexts/AuthContext';
import { RecipeInformation } from '@components/pages/App/Recipes/Recipes.types';

interface RecipeInformationModalProps {
  open: boolean;
  onClose: () => void;
  isLoading: boolean;
  recipeInfo: RecipeInformation | null;
}

export const RecipeInformationModal: React.FC<RecipeInformationModalProps> = ({
  open,
  onClose,
  isLoading,
  recipeInfo,
}) => {
  const { user, loading: authLoading } = useAuth();
  const [activeStep, setActiveStep] = useState(0);
  const [isLiked, setIsLiked] = useState(false);

  useEffect(() => {
    if (open) {
      setActiveStep(0);
    }
  }, [open]);

  const title = recipeInfo?.title || '-';
  const image = recipeInfo?.image || '';
  const summary = recipeInfo?.summary || '-';
  const caloricBreakdown = recipeInfo?.nutrition?.caloricBreakdown || {
    percentProtein: 0,
    percentFat: 0,
    percentCarbs: 0,
  };
  const readyInMinutes = recipeInfo?.readyInMinutes || '-';
  const servings = recipeInfo?.servings || '-';
  const nutrients = recipeInfo?.nutrition?.nutrients || [];
  const caloriesInfo = nutrients.find((nutrient) => nutrient.name === 'Calories');
  const extendedIngredients = recipeInfo?.extendedIngredients || [];
  const instructions = recipeInfo?.analyzedInstructions?.[0]?.steps || [];

  const caloriesPerServing = caloriesInfo
    ? `${caloriesInfo.amount} ${caloriesInfo.unit}`
    : '-';

  const sanitizedSummary = sanitizeHtml(summary, {
    allowedTags: sanitizeHtml.defaults.allowedTags.filter((tag: string) => tag !== 'a'),
  });

  const pieChartData = Object.entries(caloricBreakdown).map(([key, value]) => ({
    name: key.replace('percent', ''),
    value,
  }));

  useEffect(() => {
    const fetchLikedRecipes = async () => {
      if (!user || !recipeInfo) return;

      try {
        const userDocRef = doc(db, 'users', user.uid);
        const userDoc = await getDoc(userDocRef);

        if (userDoc.exists()) {
          const data = userDoc.data();
          const likedRecipes: number[] = data.likedRecipes || [];

          setIsLiked(likedRecipes.includes(recipeInfo.id));
        } else {
          toast.error('User document not found', { position: 'bottom-left' });
        }
      } catch (error) {
        toast.error(`Error fetching liked recipes: ${error}`, { position: 'bottom-left' });
      }
    };

    if (open && !authLoading) {
      fetchLikedRecipes();
    }
  }, [open, user, authLoading, recipeInfo?.id]);

  const handleLikeToggle = async () => {
    if (!user) {
      toast.error('User not authenticated', { position: 'bottom-left' });
      return;
    }

    try {
      const userDocRef = doc(db, 'users', user.uid);

      if (isLiked && recipeInfo) {
        await updateDoc(userDocRef, {
          likedRecipes: arrayRemove(recipeInfo.id),
        });
      } else {
        await updateDoc(userDocRef, {
          likedRecipes: arrayUnion(recipeInfo?.id),
        });
      }
      setIsLiked(!isLiked);
    } catch (error) {
      toast.error(`Error updating liked recipes: ${error}`, { position: 'bottom-left' });
    }
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      aria-labelledby='recipe-information-modal'
      aria-describedby='modal-with-recipe-information'
      closeAfterTransition
      keepMounted
    >
      <Slide in={open} timeout={500} direction='down' mountOnEnter unmountOnExit>
        <ModalContent>
          {isLoading || authLoading ? (
            <Box display='flex' justifyContent='center' alignItems='center' flexGrow={1}>
              <CircularProgress />
            </Box>
          ) : (
            <ModalContainer>
              <ModalHeader
                onClose={onClose}
                title={title}
                isLiked={isLiked}
                handleLikeToggle={handleLikeToggle}
              />
              <RecipeImageSection image={image} title={title} summary={sanitizedSummary} />
              <InfoRow>
                <InfoItem>
                  <CaloricBreakdownChart pieChartData={pieChartData} />
                </InfoItem>
                <InfoItem>
                  <RecipeInfoDetails
                    readyInMinutes={readyInMinutes}
                    servings={servings}
                    caloriesPerServing={caloriesPerServing}
                  />
                </InfoItem>
                <InfoItem>
                  <IngredientsList extendedIngredients={extendedIngredients} />
                </InfoItem>
              </InfoRow>
              {instructions.length > 0 && (
                <InstructionsStepper
                  instructions={instructions}
                  activeStep={activeStep}
                  setActiveStep={setActiveStep}
                />
              )}
            </ModalContainer>
          )}
        </ModalContent>
      </Slide>
    </Modal>
  );
};
