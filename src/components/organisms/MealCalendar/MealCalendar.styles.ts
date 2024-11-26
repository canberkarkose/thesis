/* istanbul ignore file */
import styled from '@mui/material/styles/styled';
import {
  Box, Button, Grid
} from '@mui/material';

export const CalendarContainer = styled(Box)<{
  isDashboard: boolean
}>(({ theme, isDashboard }) => ({
  marginTop: theme.spacing(5),
  padding: '16px',
  border: '1px solid #ddd',
  borderRadius: theme.spacing(2),
  background: isDashboard ? 'rgba(255, 255, 255, 0.8)' : 'none',
  boxShadow: theme.shadows[16],
  minHeight: '675px',
}));

export const HeaderContainer = styled(Box)`
  display: flex;
  justify-content: space-between;
  align-items: center;
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
  align-items: center;
  gap: ${({ isDaily }) => (isDaily ? '24px' : '8px')};
  margin-top: ${({ isDaily }) => (isDaily ? '100px' : '4px')};
`;

export const MealSlot = styled(Box)<{ isDaily: boolean }>`
  display: flex;
  position: relative;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  border: 1px solid #ddd;
  border-radius: 8px;
  width: ${({ isDaily }) => (isDaily ? '250px' : '130px')};
  height: ${({ isDaily }) => (isDaily ? '350px' : '115px')};
  max-width: ${({ isDaily }) => (isDaily ? '250px' : '130px')};
  text-align: center;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
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
