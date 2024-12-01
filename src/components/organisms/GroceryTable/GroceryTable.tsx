/* eslint-disable consistent-return */
/* eslint-disable no-plusplus */
/* eslint-disable @typescript-eslint/no-explicit-any */
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
  Tabs,
  Tab,
} from '@mui/material';

import { useNavigate } from 'react-router-dom';
import { useEffect, useRef } from 'react';

import { GroceryTableContainer } from './GroceryTable.styles';

import { TruncatedText } from '@components/atoms/TruncatedText/TruncatedText';

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
  showControls?: boolean;
  isWeeklyView?: boolean;
  setIsWeeklyView?: (isWeekly: boolean) => void;
  onIngredientCheck?: (ingredientId: number, checked: boolean) => void;
  lastInteractedIngredientId?: number | null;
}

export const GroceryTable = ({
  groupedIngredients,
  loading,
  showControls = false,
  isWeeklyView,
  setIsWeeklyView,
  onIngredientCheck = undefined,
  lastInteractedIngredientId = null,
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
        const scrollOffset = elementTop - containerTop + tableContainerRef.current.scrollTop - 20;
        tableContainerRef.current.scrollTo({
          top: scrollOffset,
          behavior: 'smooth',
        });
      }
    }
  }, [groupedIngredients, lastInteractedIngredientId]);

  const sortedAisles = Object.keys(groupedIngredients).sort((a, b) => a.localeCompare(b));

  return (
    <GroceryTableContainer hasCheckboxes={!!onIngredientCheck} ref={tableContainerRef}>
      {showControls && setIsWeeklyView && (
        <Box sx={{ display: 'flex', alignItems: 'center', marginBottom: '8px' }}>
          <Typography variant='h6' sx={{ flexGrow: 1, fontWeight: 'bold', mb: 0.5 }}>
            Your Grocery List
          </Typography>
          <Tabs
            value={isWeeklyView ? 'weekly' : 'daily'}
            onChange={(_, value) => setIsWeeklyView(value === 'weekly')}
            sx={{
              minHeight: '18px',
              '& .MuiTabs-flexContainer': {
                justifyContent: 'flex-end',
              },
              '& .MuiTabs-indicator': {
                display: 'none',
              },
            }}
          >
            <Tab
              label='Daily'
              value='daily'
              disabled={loading}
              sx={{
                textTransform: 'none',
                fontWeight: 'bold',
                borderRadius: '18px',
                marginRight: '8px',
                border: '1px solid rgba(0, 0, 0, 0.2)',
                '&.Mui-selected': {
                  backgroundColor: '#5b9d3e',
                  color: 'white',
                },
              }}
            />
            <Tab
              label='Weekly'
              value='weekly'
              disabled={loading}
              sx={{
                textTransform: 'none',
                fontWeight: 'bold',
                borderRadius: '18px',
                border: '1px solid rgba(0, 0, 0, 0.2)',
                '&.Mui-selected': {
                  backgroundColor: '#5b9d3e',
                  color: 'white',
                },
              }}
            />
          </Tabs>
        </Box>
      )}
      {loading && (
        <Box
          display='flex'
          justifyContent='center'
          alignItems='center'
          height='100%'
          sx={{
            mt: onIngredientCheck ? '25%' : '30%',
          }}
        >
          <CircularProgress />
        </Box>
      )}
      {(Object.keys(groupedIngredients).length === 0 && !loading) && (
        <Box
          display='flex'
          flexDirection='column'
          justifyContent='center'
          alignItems='center'
          height='100%'
          sx={{
            mt: onIngredientCheck ? '225px' : '105px',
          }}
        >
          <Typography variant='h4' gutterBottom>
            No ingredients to display
          </Typography>
          <Typography variant='body1' gutterBottom>
            You don&apos;t have any meals planned for
            {' '}
            {isWeeklyView ? 'this week' : 'today'}
            .
          </Typography>
          <Button
            variant='contained'
            onClick={() => {
              navigate('/app/meal-planner');
            }}
            sx={{
              mt: 2,
              color: 'white',
              backgroundColor: '#5c9c3e',
              '&:hover': {
                backgroundColor: '#406d2b',
              },
            }}
          >
            Go to Meal Planner
          </Button>
        </Box>
      )}
      {!loading && sortedAisles.map((aisle) => {
        const sortedIngredients = [...groupedIngredients[aisle]]
          .sort((a, b) => a.name.localeCompare(b.name));
        return (
          <Box key={aisle} mb={2}>
            <Typography variant='h6' sx={{ backgroundColor: '#f5f5f5', padding: '8px' }}>
              {aisle}
            </Typography>
            <TableContainer component={Paper}>
              <Table style={{ tableLayout: 'fixed' }}>
                <TableBody>
                  {sortedIngredients.map((ingredient) => (
                    <TableRow key={ingredient.id} id={`ingredient-${ingredient.id}`}>
                      {onIngredientCheck && (
                        <TableCell padding='checkbox'>
                          <Checkbox
                            checked={ingredient.checked || false}
                            onChange={(e) => onIngredientCheck(ingredient.id, e.target.checked)}
                          />
                        </TableCell>
                      )}
                      {!onIngredientCheck && <TableCell padding='checkbox' />}
                      <TableCell>
                        <img
                          src={`https://spoonacular.com/cdn/ingredients_100x100/${ingredient.image}`}
                          alt={ingredient.name}
                          style={{ width: '50px', height: '50px', objectFit: 'cover' }}
                        />
                      </TableCell>
                      <TableCell>
                        <Typography variant='body1'>
                          <TruncatedText text={ingredient.name} />
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
        );
      })}
    </GroceryTableContainer>
  );
};
