/* eslint-disable import/no-cycle */
import React from 'react';
import {
  Box,
  Button,
  IconButton,
  Tooltip,
  Typography,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import CancelIcon from '@mui/icons-material/Cancel';

import { dataTestIds } from '../../../dataTest/dataTestIds';

import { DateNavigatorContainer } from './DateNavigator.styles';

import { Recipe } from '@components/organisms/MealCalendar/MealCalendar';

interface DateNavigatorProps {
  isViewDaily: boolean;
  currentDate: Date;
  minDailyDate: Date;
  minWeeklyDate: Date;
  maxDailyDate: Date;
  maxWeeklyDate: Date;
  formatDisplayDate: () => string;
  changeDate: (direction: 'back' | 'forward') => void;
  showEditButton: boolean;
  editMode: boolean;
  setEditMode: (editMode: boolean) => void;
  recipeToAdd?: Recipe | null;
}

export const DateNavigator: React.FC<DateNavigatorProps> = ({
  isViewDaily,
  currentDate,
  minDailyDate,
  minWeeklyDate,
  maxDailyDate,
  maxWeeklyDate,
  formatDisplayDate,
  changeDate,
  showEditButton,
  editMode,
  setEditMode,
  recipeToAdd,
}) => (
  <DateNavigatorContainer>
    <Box width='48px' />
    <Box display='flex' alignItems='center' justifyContent='center' flexGrow={1}>
      <Button
        data-testid={dataTestIds.components.dateNavigator.previousButton}
        onClick={() => changeDate('back')}
        variant='outlined'
        disabled={
          currentDate.getTime()
          <= (isViewDaily ? minDailyDate.getTime() : minWeeklyDate.getTime())
        }
        sx={{
          '&:hover': {
            backgroundColor: '#6a8f17',
            color: '#fff',
          },
        }}
      >
        {isViewDaily ? 'Previous Day' : 'Previous Week'}
      </Button>
      <Typography
        data-testid={dataTestIds.components.dateNavigator.dateDisplay}
        variant='body1'
        sx={{ mt: 0.7, mx: 2 }}
      >
        {formatDisplayDate()}
      </Typography>
      <Button
        data-testid={dataTestIds.components.dateNavigator.nextButton}
        onClick={() => changeDate('forward')}
        variant='outlined'
        disabled={
          currentDate.getTime()
          >= (isViewDaily ? maxDailyDate.getTime() : maxWeeklyDate.getTime())
        }
        sx={{
          '&:hover': {
            backgroundColor: '#6a8f17',
            color: '#fff',
          },
        }}
      >
        {isViewDaily ? 'Next Day' : 'Next Week'}
      </Button>
    </Box>
    <Box display='flex' alignItems='center' justifyContent='flex-end' width='48px'>
      <Tooltip
        title={editMode ? 'Cancel' : 'Edit'}
        arrow
        disableInteractive
        enterDelay={0}
      >
        <IconButton
          data-testid={dataTestIds.components.dateNavigator.editButton}
          onClick={() => setEditMode(!editMode)}
          disabled={recipeToAdd !== null}
          sx={{
            color: editMode ? '#dd2a2a' : 'black',
            visibility: showEditButton ? 'visible' : 'hidden',
            mr: 8.5,
          }}
        >
          {editMode ? <CancelIcon /> : <EditIcon />}
        </IconButton>
      </Tooltip>
    </Box>
  </DateNavigatorContainer>
);
