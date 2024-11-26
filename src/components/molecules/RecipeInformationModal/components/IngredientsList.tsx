import React from 'react';

import { dataTestIds } from '../../../../dataTest/dataTestIds';

import {
  InfoTitle,
  IngredientList,
  IngredientItem,
  IngredientText,
  IngredientImage,
  PlaceholderIngredientImage,
} from '../RecipeInformationModal.styles';

interface IngredientsListProps {
  extendedIngredients: {
    id: number;
    original: string;
    image: string;
    name: string;
  }[];
}

export const IngredientsList: React.FC<IngredientsListProps> = ({
  extendedIngredients,
}) => (
  <div data-testid={dataTestIds.components.ingredientsList.container}>
    <InfoTitle>Ingredients</InfoTitle>
    <IngredientList>
      {extendedIngredients.map((ingredient) => (
        <IngredientItem
          key={ingredient.id}
          data-testid={dataTestIds.components.ingredientsList.ingredientItem(ingredient.id)}
        >
          <IngredientText>{ingredient.original}</IngredientText>
          {ingredient.image ? (
            <IngredientImage
              src={`https://spoonacular.com/cdn/ingredients_100x100/${ingredient.image}`}
              alt={ingredient.name}
              data-testid={dataTestIds.components.ingredientsList.ingredientImage(ingredient.id)}
            />
          ) : (
            <PlaceholderIngredientImage
              data-testid={dataTestIds.components.ingredientsList.placeholderImage(ingredient.id)}
            >
              No Image
            </PlaceholderIngredientImage>
          )}
        </IngredientItem>
      ))}
    </IngredientList>
  </div>
);
