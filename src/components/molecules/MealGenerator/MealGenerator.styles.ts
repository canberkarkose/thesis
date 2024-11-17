// mealGenerator.styles.ts

import { styled } from '@mui/material/styles';
import {
  Box, Button, Tabs, TextField
} from '@mui/material';

export const GeneratorContainer = styled(Box)(({ theme }) => ({
  padding: theme.spacing(4),
  backgroundColor: '#f5f5f5',
  borderRadius: theme.spacing(2),
  boxShadow: theme.shadows[3],
  marginBottom: theme.spacing(4),
  width: '80%',
  margin: '0 auto',
  minHeight: '300px',
}));

export const TabsContainer = styled(Tabs)(({ theme }) => ({
  marginBottom: theme.spacing(3),
}));

export const TabPanel = styled(Box)(({ theme }) => ({
  padding: theme.spacing(2),
}));

export const GenerateButton = styled(Button)(({ theme }) => ({
  marginTop: theme.spacing(3),
  backgroundColor: '#5b9d3e',
  '&:hover': {
    backgroundColor: '#4a8c34',
  },
}));

export const InputField = styled(TextField)(({ theme }) => ({
  marginBottom: theme.spacing(2),
}));
