// MealCalendar.styles.ts

import styled from '@mui/material/styles/styled';
import {
  Box, Typography, Button, Grid
} from '@mui/material';

export const CalendarContainer = styled(Box)(({ theme }) => ({
  marginTop: theme.spacing(5),
  padding: '16px',
  border: '1px solid #ddd',
  borderRadius: theme.spacing(2),
  boxShadow: theme.shadows[16],
  minHeight: '655px',
}));

export const HeaderContainer = styled(Box)`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
  padding: 8px;
`;

export const DateNavigator = styled(Box)`
  display: flex;
  justify-content: center;
  gap: 16px;
  margin-bottom: 16px;
  margin-right: 16px;
`;

export const MealSlotContainer = styled(Box)<{ isDaily: boolean }>`
  display: flex;
  flex-direction: ${({ isDaily }) => (isDaily ? 'row' : 'column')};
  justify-content: ${({ isDaily }) => (isDaily ? 'center' : 'flex-start')};
  align-items: ${({ isDaily }) => (isDaily ? 'center' : 'stretch')};
  gap: ${({ isDaily }) => (isDaily ? '24px' : '16px')};
  margin-top: ${({ isDaily }) => (isDaily ? '120px' : '16px')};
  ${({ isDaily }) => isDaily
    && `
      height: 100%;
      justify-content: center;
    `}
`;

export const MealSlot = styled(Box)<{ isDaily: boolean }>`
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: ${({ isDaily, theme }) => (isDaily ? theme.spacing(6) : theme.spacing(3))};
  width: ${({ isDaily, theme }) => (isDaily ? theme.spacing(35) : theme.spacing(20))};
  max-width: ${({ isDaily, theme }) => (isDaily ? theme.spacing(35) : theme.spacing(20))};
  text-align: center;
  transition: all 0.3s ease-in-out;

  ${({ isDaily }) => isDaily
    && `
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      height: 250px;
    `}
`;

export const DayContainer = styled(Grid)`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
`;

export const ToggleViewButton = styled(Button)`
  background-color: #1976d2;
  color: white;
  &:hover {
    background-color: #1565c0;
  }
`;

export const EmptySlotText = styled(Typography)`
  color: #b0b0b0;
  font-size: 0.875rem;
`;
