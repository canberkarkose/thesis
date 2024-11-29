import { styled } from '@mui/material/styles';
import { Box, StepButton, Typography } from '@mui/material';

export const ModalContent = styled(Box)(({ theme }) => ({
  position: 'absolute',
  transform: 'translate(-50%, -50%)',
  width: '80%',
  maxWidth: '1500px',
  height: '75%',
  maxHeight: '95vh',
  backgroundColor: theme.palette.background.paper,
  boxShadow: theme.shadows[24],
  padding: theme.spacing(4),
  outline: 'none',
  borderRadius: '8px',
  display: 'flex',
  flexDirection: 'column',
  marginLeft: '12%',
  marginTop: '11%',
  overflowY: 'auto',
  scrollbarWidth: 'none',
  [theme.breakpoints.down('md')]: {
    width: '80%',
    height: '70%',
  },
  [theme.breakpoints.down('sm')]: {
    width: '90%',
    height: '80%',
  },
}));

export const ModalContainer = styled(Box)(() => ({
  width: '100%',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
}));

export const Title = styled(Typography)(({ theme }) => ({
  fontWeight: 'bold',
  textAlign: 'center',
  marginBottom: theme.spacing(1),
  color: '#3C4C3D',
}));

export const RecipeImage = styled('img')(({ theme }) => ({
  width: '200px',
  height: '200px',
  borderRadius: '12px',
  objectFit: 'cover',
  alignSelf: 'center',
  marginRight: theme.spacing(2),
  [theme.breakpoints.down('sm')]: {
    marginRight: 0,
    marginBottom: theme.spacing(2),
  },
}));

export const PlaceholderImage = styled(Box)(({ theme }) => ({
  width: '250px',
  height: '250px',
  borderRadius: '12px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  backgroundColor: '#e0e0e0',
  color: '#888',
  alignSelf: 'center',
  marginRight: theme.spacing(2),
  [theme.breakpoints.down('sm')]: {
    marginRight: 0,
    marginBottom: theme.spacing(2),
  },
}));

export const Description = styled(Box)(({ theme }) => ({
  flex: 1,
  color: theme.palette.text.primary,
  fontSize: '16px',
}));

export const ContentContainer = styled(Box)(({ theme }) => ({
  width: '100%',
  display: 'flex',
  backgroundColor: '#eef7cf',
  borderRadius: '12px',
  padding: theme.spacing(2),
  marginTop: theme.spacing(2),
  alignItems: 'center',
  [theme.breakpoints.down('sm')]: {
    flexDirection: 'column',
    alignItems: 'center',
  },
}));

export const InfoRow = styled(Box)(({ theme }) => ({
  width: '100%',
  display: 'flex',
  justifyContent: 'space-evenly',
  alignItems: 'center',
  backgroundColor: '#d6ea87',
  borderRadius: '12px',
  gap: theme.spacing(10),
  padding: theme.spacing(2),
  marginTop: theme.spacing(1),
  [theme.breakpoints.down('sm')]: {
    flexDirection: 'column',
    alignItems: 'center',
  },
}));

export const InfoItem = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  [theme.breakpoints.down('sm')]: {
    marginBottom: theme.spacing(2),
  },
}));

export const InfoRowInner = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'center',
  alignItems: 'center',
  gap: theme.spacing(4),
  marginTop: theme.spacing(1),
  [theme.breakpoints.down('sm')]: {
    flexDirection: 'column',
    alignItems: 'center',
  },
}));

export const InfoText = styled(Box)(() => ({
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  whiteSpace: 'nowrap',
}));

export const InfoTitle = styled(Typography)(() => ({
  fontWeight: 'bold',
  fontSize: '1rem',
}));

export const CalorieBreakdownText = styled(Typography)(() => ({
  fontSize: '1.2rem',
  fontWeight: 'bold',
}));

export const InfoValue = styled(Typography)(() => ({
  fontSize: '1rem',
}));

export const CaloriesContainer = styled(Box)(({ theme }) => ({
  marginTop: theme.spacing(2),
  display: 'flex',
  justifyContent: 'center',
}));

export const IngredientList = styled(Box)(({ theme }) => ({
  flex: 1,
  overflowY: 'auto',
  maxHeight: '200px',
  padding: theme.spacing(1),
  '&::-webkit-scrollbar': {
    width: 0,
    height: 0,
  },
  '-ms-overflow-style': 'none',
  'scrollbar-width': 'none',
}));

export const IngredientItem = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: theme.spacing(1),
  borderRadius: theme.shape.borderRadius,
  transition: 'background-color 0.2s',
  cursor: 'default',
  '&:hover': {
    backgroundColor: '#839d1b',
  },
}));

export const IngredientText = styled(Typography)(({ theme }) => ({
  fontSize: '0.9rem',
  color: theme.palette.text.primary,
  flex: 1,
  marginRight: theme.spacing(1),
}));

export const IngredientImage = styled('img')(() => ({
  width: '40px',
  height: '40px',
  borderRadius: '4px',
  objectFit: 'cover',
}));

export const PlaceholderIngredientImage = styled(Box)(() => ({
  width: '40px',
  height: '40px',
  borderRadius: '4px',
  backgroundColor: '#e0e0e0',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  color: '#888',
  fontSize: '0.8rem',
}));

export const InstructionsContainer = styled(Box)(({ theme }) => ({
  width: '100%',
  backgroundColor: '#b8da2e',
  borderRadius: '12px',
  padding: theme.spacing(5),
  marginTop: theme.spacing(1),
  display: 'flex',
  flexDirection: 'column',
}));

export const InstructionTitle = styled(Typography)(({ theme }) => ({
  fontWeight: 'bold',
  fontSize: '1.5rem',
  marginBottom: theme.spacing(2),
  textAlign: 'center',
}));

export const StepTextBox = styled(Box)(({ theme }) => ({
  backgroundColor: '#dcdcdc',
  borderRadius: '12px',
  padding: theme.spacing(2),
  flex: 1,
}));

export const StepText = styled(Typography)(() => ({
  fontSize: '1.1rem',
  alignSelf: 'center',
}));

export const StepListsContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  marginTop: theme.spacing(1),
  gap: theme.spacing(2),
  backgroundColor: 'transparent',
  [theme.breakpoints.down('sm')]: {
    flexDirection: 'column',
    alignItems: 'center',
  },
}));

export const CustomStepButton = styled(StepButton)(() => ({
  '& .MuiTouchRipple-root': {
    display: 'none',
  },
}));

export const InstructionListContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'space-between',
  marginTop: theme.spacing(2),
  [theme.breakpoints.down('sm')]: {
    flexDirection: 'column',
    alignItems: 'center',
  },
}));

export const InstructionList = styled(Box)(({ theme }) => ({
  width: '48%',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  [theme.breakpoints.down('sm')]: {
    width: '100%',
    marginBottom: theme.spacing(2),
  },
}));

export const InstructionListTitle = styled(Typography)(({ theme }) => ({
  fontWeight: 'bold',
  fontSize: '1.2rem',
  marginBottom: theme.spacing(1),
  textAlign: 'center',
}));

export const InstructionListItems = styled(Box)(() => ({
  width: '100%',
  maxHeight: '200px',
  overflowY: 'auto',
  '&::-webkit-scrollbar': {
    width: 0,
    height: 0,
  },
  '-ms-overflow-style': 'none',
  'scrollbar-width': 'none',
}));

export const InstructionListItem = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: theme.spacing(1),
  borderRadius: theme.shape.borderRadius,
  backgroundColor: '#d3d3d359',
  cursor: 'default',
  width: '100%',
  '&:hover': {
    backgroundColor: '#6f8517',
  },
}));

export const InstructionListText = styled(Typography)(({ theme }) => ({
  fontSize: '0.9rem',
  color: theme.palette.text.primary,
  flex: 1,
  marginRight: theme.spacing(1),
}));

export const InstructionListImage = styled('img')(() => ({
  width: '40px',
  height: '40px',
  borderRadius: '4px',
  objectFit: 'cover',
}));

export const PlaceholderInstructionListImage = styled(Box)(() => ({
  width: '40px',
  height: '40px',
  borderRadius: '4px',
  backgroundColor: '#e0e0e0',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  color: '#888',
  fontSize: '0.8rem',
}));
