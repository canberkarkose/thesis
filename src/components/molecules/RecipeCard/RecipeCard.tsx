import {
  Box, Typography, Tooltip, Button,
  IconButton
} from '@mui/material';
import { useRef, useState, useEffect } from 'react';
import parse from 'html-react-parser';
import sanitizeHtml from 'sanitize-html';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';

import { dataTestIds } from '../../../dataTest/dataTestIds';

import {
  RecipeCardContainer, RecipeImage, DescriptionContainer, PlaceholderImage
} from './RecipeCard.styles';

interface RecipeCardProps {
  image?: string;
  title: string;
  description?: string;
  onSeeMore: () => void;
  showAddButton?: boolean;
  onAddToMealPlan?: () => void;
  isAddButtonDisabled?: boolean;
  isActive?: boolean;
}

export const RecipeCard = ({
  image,
  title,
  description,
  onSeeMore,
  showAddButton,
  onAddToMealPlan,
  isAddButtonDisabled,
  isActive
}: RecipeCardProps) => {
  const titleRef = useRef<HTMLDivElement>(null);
  const [isTitleTruncated, setIsTitleTruncated] = useState(false);

  let sanitizedDescription = '';
  if (description) {
    sanitizedDescription = sanitizeHtml(description, {
      allowedTags: sanitizeHtml.defaults.allowedTags.filter((tag: string) => tag !== 'a'),
    });
  }

  useEffect(() => {
    if (titleRef.current) {
      setIsTitleTruncated(titleRef.current.scrollWidth > titleRef.current.clientWidth);
    }
  }, [title]);

  return (
    <RecipeCardContainer data-testid={dataTestIds.components.recipeCard.container}>
      {image ? (
        <RecipeImage
          src={image}
          alt={title}
          data-testid={dataTestIds.components.recipeCard.image}
        />
      ) : (
        <PlaceholderImage data-testid={dataTestIds.components.recipeCard.placeholderImage}>
          <Typography variant='body2' color='textSecondary' fontSize='1rem'>
            Image Unavailable
          </Typography>
        </PlaceholderImage>
      )}
      <Box padding='8px'>
        {isTitleTruncated ? (
          <Tooltip title={title} arrow disableInteractive>
            <Typography
              ref={titleRef}
              variant='h6'
              fontWeight='bold'
              gutterBottom
              textAlign='center'
              data-testid={dataTestIds.components.recipeCard.title}
              sx={{
                mt: -2,
                overflow: 'hidden',
                whiteSpace: 'nowrap',
                textOverflow: 'ellipsis',
                fontSize: '18px',
              }}
            >
              {title}
            </Typography>
          </Tooltip>
        ) : (
          <Typography
            ref={titleRef}
            variant='h6'
            fontWeight='bold'
            gutterBottom
            textAlign='center'
            data-testid={dataTestIds.components.recipeCard.title}
            sx={{
              mt: -2,
              overflow: 'hidden',
              whiteSpace: 'nowrap',
              textOverflow: 'ellipsis',
              fontSize: '18px',
            }}
          >
            {title}
          </Typography>
        )}
        {description && (
          <DescriptionContainer data-testid={dataTestIds.components.recipeCard.description}>
            <Typography
              variant='body2'
              sx={{
                overflow: 'hidden',
                display: '-webkit-box',
                WebkitBoxOrient: 'vertical',
                WebkitLineClamp: 8,
                textOverflow: 'ellipsis',
                fontSize: '15px',
              }}
            >
              {parse(sanitizedDescription)}
            </Typography>
          </DescriptionContainer>
        )}
        <Button
          variant='contained'
          data-testid={dataTestIds.components.recipeCard.seeMoreButton}
          sx={{
            mt: '16px',
            ml: 'auto',
            mr: 'auto',
            display: 'block',
            backgroundColor: '#89a313',
            '&:hover': {
              backgroundColor: '#5d6e0d'
            }
          }}
          onClick={onSeeMore}
        >
          See More
        </Button>
      </Box>
      {showAddButton && (
        <Tooltip title={isActive ? 'Cancel' : 'Add to meal plan'} arrow>
          <IconButton
            data-testid={dataTestIds.components.recipeCard.addButton}
            onClick={onAddToMealPlan}
            disabled={isAddButtonDisabled}
            sx={{
              position: 'absolute',
              top: '8px',
              right: '8px',
              backgroundColor: isActive ? '#d9534f' : '#89a313',
              color: '#fff',
              '&:hover': {
                backgroundColor: isActive ? '#c9302c' : '#5d6e0d',
              },
              '&:disabled': {
                backgroundColor: '#ccc',
              },
            }}
            size='large'
          >
            {isActive
              ? <RemoveIcon data-testid={dataTestIds.components.recipeCard.removeIcon} />
              : <AddIcon data-testid={dataTestIds.components.recipeCard.addIcon} />}
          </IconButton>
        </Tooltip>
      )}
    </RecipeCardContainer>
  );
};
