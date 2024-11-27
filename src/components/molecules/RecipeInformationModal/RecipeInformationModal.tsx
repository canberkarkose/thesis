import React, { useState, useEffect } from 'react';
import { Modal, Box, CircularProgress } from '@mui/material';
import Slide from '@mui/material/Slide';
import sanitizeHtml from 'sanitize-html';

import {
  arrayRemove, arrayUnion, doc, getDoc, updateDoc
} from 'firebase/firestore';
import { toast } from 'react-toastify';

import { dataTestIds } from '../../../dataTest/dataTestIds';

import {
  ModalContent, ModalContainer, InfoRow, InfoItem
} from './RecipeInformationModal.styles';

import { ModalHeader } from './components/ModalHeader';
import { RecipeImageSection } from './components/RecipeImageSection';
import { CaloricBreakdownChart } from './components/CaloricBreakdownChart';
import { RecipeInfoDetails } from './components/RecipeInfoDetails';
import { IngredientsList } from './components/IngredientsList';
import { InstructionsStepper } from './components/InstructionsStepper';

import { MealPlanCalendar } from './components/MealPlanCalendar'; // Import the MealPlanCalendar component

import { getMealTypeOptions } from './helpers/helpers';

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
  const [selectedMealType, setSelectedMealType] = useState<string | null>(null);
  const [showCalendar, setShowCalendar] = useState(false);

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

  /* istanbul ignore next */
  const handleMealTypeSelect = (mealType: string) => {
    setSelectedMealType(mealType);
    setShowCalendar(true);
  };

  /* istanbul ignore next */
  const handleCalendarClose = () => {
    setShowCalendar(false);
    setSelectedMealType(null);
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      aria-labelledby='recipe-information-modal'
      aria-describedby='modal-with-recipe-information'
      closeAfterTransition
      keepMounted
      data-testid={dataTestIds.components.recipeInformationModal.modal}
    >
      <Slide
        in={open}
        timeout={500}
        direction='down'
        mountOnEnter
        unmountOnExit
        data-testid={dataTestIds.components.recipeInformationModal.slide}
      >
        <ModalContent data-testid={dataTestIds.components.recipeInformationModal.modalContent}>
          {isLoading || authLoading ? (
            <Box
              display='flex'
              justifyContent='center'
              alignItems='center'
              flexGrow={1}
              data-testid={dataTestIds.components.recipeInformationModal.loadingIndicator}
            >
              <CircularProgress />
            </Box>
          ) : (
            <ModalContainer
              data-testid={dataTestIds.components.recipeInformationModal.modalContainer}
            >
              <ModalHeader
                onClose={onClose}
                title={title}
                isLiked={isLiked}
                handleLikeToggle={handleLikeToggle}
                mealTypeOptions={getMealTypeOptions(recipeInfo)}
                onMealTypeSelect={handleMealTypeSelect}
                data-testid={dataTestIds.components.recipeInformationModal.modalHeader}
              />
              {showCalendar && selectedMealType && (
                <MealPlanCalendar
                  onClose={handleCalendarClose}
                  mealType={selectedMealType}
                  recipeInfo={recipeInfo}
                  data-testid={dataTestIds.components.recipeInformationModal.mealPlanCalendar}
                />
              )}
              <RecipeImageSection
                image={image}
                title={title}
                summary={sanitizedSummary}
                data-testid={dataTestIds.components.recipeInformationModal.recipeImageSection}
              />
              <InfoRow data-testid={dataTestIds.components.recipeInformationModal.infoRow}>
                <InfoItem
                  data-testid={dataTestIds.components.recipeInformationModal.caloricBreakdownChart}
                >
                  <CaloricBreakdownChart pieChartData={pieChartData} />
                </InfoItem>
                <InfoItem
                  data-testid={dataTestIds.components.recipeInformationModal.recipeInfoDetails}
                >
                  <RecipeInfoDetails
                    readyInMinutes={readyInMinutes}
                    servings={servings}
                    caloriesPerServing={caloriesPerServing}
                  />
                </InfoItem>
                <InfoItem
                  data-testid={dataTestIds.components.recipeInformationModal.ingredientsList}
                >
                  <IngredientsList extendedIngredients={extendedIngredients} />
                </InfoItem>
              </InfoRow>
              {instructions.length > 0 && (
                <InstructionsStepper
                  instructions={instructions}
                  activeStep={activeStep}
                  setActiveStep={setActiveStep}
                  data-testid={dataTestIds.components.recipeInformationModal.instructionsStepper}
                />
              )}
            </ModalContainer>
          )}
        </ModalContent>
      </Slide>
    </Modal>
  );
};
