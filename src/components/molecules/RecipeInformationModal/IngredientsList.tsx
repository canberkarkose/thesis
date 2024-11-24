import React from 'react';

import {
  InfoTitle,
  IngredientList,
  IngredientItem,
  IngredientText,
  IngredientImage,
  PlaceholderIngredientImage,
} from './RecipeInformationModal.styles';

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
  <>
    <InfoTitle>Ingredients</InfoTitle>
    <IngredientList>
      {extendedIngredients.map((ingredient) => (
        <IngredientItem key={ingredient.id}>
          <IngredientText>{ingredient.original}</IngredientText>
          {ingredient.image ? (
            <IngredientImage
              src={`https://spoonacular.com/cdn/ingredients_100x100/${ingredient.image}`}
              alt={ingredient.name}
            />
          ) : (
            <PlaceholderIngredientImage>No Image</PlaceholderIngredientImage>
          )}
        </IngredientItem>
      ))}
    </IngredientList>
  </>
);
