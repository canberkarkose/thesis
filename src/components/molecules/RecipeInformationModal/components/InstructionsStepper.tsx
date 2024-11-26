/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';
import { Box, Stepper, Step } from '@mui/material';

import { dataTestIds } from '../../../../dataTest/dataTestIds';

import {
  InstructionsContainer,
  InstructionTitle,
  StepTextBox,
  StepText,
  CustomStepButton,
  InstructionListContainer,
  InstructionList,
  InstructionListImage,
  InstructionListItem,
  InstructionListItems,
  InstructionListText,
  InstructionListTitle,
  PlaceholderInstructionListImage,
} from '../RecipeInformationModal.styles';
import { getImageSrc } from '../helpers/helpers';

interface InstructionsStepperProps {
  instructions: any[];
  activeStep: number;
  setActiveStep: (step: number) => void;
}

export const InstructionsStepper: React.FC<InstructionsStepperProps> = ({
  instructions,
  activeStep,
  setActiveStep,
}) => {
  const hasIngredients = instructions[activeStep]?.ingredients?.length > 0;
  const hasEquipment = instructions[activeStep]?.equipment?.length > 0;
  const numLists = (hasIngredients ? 1 : 0) + (hasEquipment ? 1 : 0);

  return (
    <InstructionsContainer data-testid={dataTestIds.components.instructionsStepper.container}>
      <InstructionTitle>Step by Step Implementation</InstructionTitle>
      <Stepper
        nonLinear
        activeStep={activeStep}
        sx={{
          '& .MuiStepIcon-root': {
            fontSize: '1.5rem',
          },
        }}
      >
        {instructions.map((step, index) => (
          <Step key={step.number} expanded>
            <CustomStepButton sx={{ size: 50 }} onClick={() => setActiveStep(index)} />
          </Step>
        ))}
      </Stepper>
      {instructions[activeStep] && (
        <Box mt={2}>
          <StepTextBox>
            <StepText>{instructions[activeStep].step}</StepText>
          </StepTextBox>
          {(hasIngredients || hasEquipment) && (
            <InstructionListContainer
              sx={{ justifyContent: numLists === 1 ? 'center' : 'space-between' }}
            >
              {hasIngredients && (
                <InstructionList>
                  <InstructionListTitle>Step Ingredients</InstructionListTitle>
                  <InstructionListItems>
                    {instructions[activeStep].ingredients.map((ingredient: any) => (
                      <InstructionListItem key={ingredient.id}>
                        <InstructionListText>{ingredient.name}</InstructionListText>
                        {ingredient.image ? (
                          <InstructionListImage
                            src={getImageSrc(ingredient.image, 'ingredient')}
                            alt={ingredient.name}
                          />
                        ) : (
                          <PlaceholderInstructionListImage>
                            No Image
                          </PlaceholderInstructionListImage>
                        )}
                      </InstructionListItem>
                    ))}
                  </InstructionListItems>
                </InstructionList>
              )}
              {hasEquipment && (
                <InstructionList>
                  <InstructionListTitle>Step Equipment</InstructionListTitle>
                  <InstructionListItems>
                    {instructions[activeStep].equipment.map((equipment: any) => (
                      <InstructionListItem key={equipment.id}>
                        <InstructionListText>{equipment.name}</InstructionListText>
                        {equipment.image ? (
                          <InstructionListImage
                            src={getImageSrc(equipment.image, 'equipment')}
                            alt={equipment.name}
                          />
                        ) : (
                          <PlaceholderInstructionListImage>
                            No Image
                          </PlaceholderInstructionListImage>
                        )}
                      </InstructionListItem>
                    ))}
                  </InstructionListItems>
                </InstructionList>
              )}
            </InstructionListContainer>
          )}
        </Box>
      )}
    </InstructionsContainer>
  );
};
