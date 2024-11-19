import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Paper,
  Checkbox,
  CircularProgress,
  Button,
} from '@mui/material';

import { useNavigate } from 'react-router-dom';

import { useEffect, useRef } from 'react';

import { GroceryTableContainer } from './GroceryTable.styles';

import TruncatedText from '@components/atoms/TruncatedText/TruncatedText';

interface Ingredient {
  id: number;
  name: string;
  aisle: string;
  image: string;
  amount: number;
  unit: string;
  checked?: boolean;
}

interface GroceryTableProps {
  groupedIngredients: { [key: string]: Ingredient[] };
  loading: boolean;
  onIngredientCheck: (ingredientId: number, checked: boolean) => void;
  lastInteractedIngredientId: number | null;
}

export const GroceryTable = ({
  groupedIngredients,
  loading,
  onIngredientCheck,
  lastInteractedIngredientId
}: GroceryTableProps) => {
  const navigate = useNavigate();
  const tableContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (lastInteractedIngredientId !== null) {
      // Find the DOM element of the last interacted item
      const element = document.getElementById(`ingredient-${lastInteractedIngredientId}`);
      if (element && tableContainerRef.current) {
        // Scroll the container to the element
        const containerTop = tableContainerRef.current.getBoundingClientRect().top;
        const elementTop = element.getBoundingClientRect().top;
        const scrollOffset = elementTop
        - containerTop + tableContainerRef.current.scrollTop - 55;
        tableContainerRef.current.scrollTo({
          top: scrollOffset,
          behavior: 'smooth',
        });
      }
    }
  }, [groupedIngredients, lastInteractedIngredientId]);

  if (loading) {
    return (
      <GroceryTableContainer>
        <Box
          display='flex'
          justifyContent='center'
          alignItems='center'
          height='100%'
          sx={{
            mt: '25%',
          }}
        >
          <CircularProgress />
        </Box>
      </GroceryTableContainer>
    );
  }

  if (Object.keys(groupedIngredients).length === 0) {
    return (
      <GroceryTableContainer>
        <Box
          display='flex'
          flexDirection='column'
          justifyContent='center'
          alignItems='center'
          height='100%'
          sx={{
            mt: '20%',
          }}
        >
          <Typography variant='h4' gutterBottom>
            No ingredients to display.
          </Typography>
          <Typography variant='body1' gutterBottom>
            You don&apos;t have any meals planned.
          </Typography>
          <Button
            variant='contained'
            color='primary'
            onClick={() => {
              navigate('/app/meal-planner');
            }}
          >
            Go to Meal Planner
          </Button>
        </Box>
      </GroceryTableContainer>
    );
  }

  return (
    <GroceryTableContainer ref={tableContainerRef}>
      {Object.keys(groupedIngredients).map((aisle) => (
        <Box key={aisle} mb={2}>
          <Typography variant='h6' sx={{ backgroundColor: '#f5f5f5', padding: '8px' }}>
            {aisle}
          </Typography>
          <TableContainer component={Paper}>
            <Table style={{ tableLayout: 'fixed' }}>
              <TableBody>
                {groupedIngredients[aisle].map((ingredient) => (
                  <TableRow key={ingredient.id} id={`ingredient-${ingredient.id}`}>
                    <TableCell padding='checkbox'>
                      <Checkbox
                        checked={ingredient.checked || false}
                        onChange={(e) => onIngredientCheck(ingredient.id, e.target.checked)}
                      />
                    </TableCell>
                    <TableCell>
                      <img
                        src={`https://spoonacular.com/cdn/ingredients_100x100/${ingredient.image}`}
                        alt={ingredient.name}
                        style={{ width: '50px', height: '50px', objectFit: 'cover' }}
                      />
                    </TableCell>
                    <TableCell>
                      <Typography variant='body1'>
                        <TruncatedText
                          text={ingredient.name}
                        />
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant='body2'>
                        {`${ingredient.amount.toFixed(2)} ${ingredient.unit}`}
                      </Typography>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      ))}
    </GroceryTableContainer>
  );
};
