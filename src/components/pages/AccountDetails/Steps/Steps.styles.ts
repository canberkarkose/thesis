/* istanbul ignore file */
import styled from '@emotion/styled';

import { Button, ToggleButtonGroup } from '@mui/material';

import {
  Whole30Logo,
  GlutenFreeLogo,
  KetogenicLogo,
  VegetarianLogo,
  NoEggLogo,
  DairyFreeLogo,
  VeganLogo,
  SeafoodLogo,
  PaleoDietLogo,
  AnythingLogo,
} from '@src/assets';

export const StepContentWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: start;
  align-items: center;
  width: 100%;
  height: 100%;
  overflow-y: auto;
  padding: 20px;

  @media (max-width: 768px) {
    padding: 10px;
  }
`;

export const IntoleranceButton = styled(Button)`
  margin: 8px;
  border-radius: 10px;
  width: calc(25% - 70px);
  border: 1px solid rgba(0, 0, 0, 0.7);
  color: rgba(0, 0, 0, 0.87);
  
  &.selected {
    background-color: rgba(0, 0, 0, 0.3);
    color: white;
  }
`;

export const StyledToggleButtonGroup = styled(ToggleButtonGroup)`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 10px;
  width: 100%;

  .MuiToggleButton-root {
    border-top: 1px solid rgba(0, 0, 0, 0.12);
    padding: 8px;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: start;
    text-align: left;
    border-radius: 10px;

    &.Mui-selected {
      background-color: rgba(0, 0, 0, 0.2);
    }
  }

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const baseSvgStyle = `
  width: 35px;
  height: 35px;
`;

export const StyledGlutenFree = styled(GlutenFreeLogo)`
  ${baseSvgStyle}
`;

export const StyledKetogenic = styled(KetogenicLogo)`
  ${baseSvgStyle}
`;

export const StyledVegetarian = styled(VegetarianLogo)`
  ${baseSvgStyle}
`;

export const StyledLactoVegetarian = styled(NoEggLogo)`
  ${baseSvgStyle}
`;

export const StyledOvoVegetarian = styled(DairyFreeLogo)`
  ${baseSvgStyle}
`;

export const StyledVegan = styled(VeganLogo)`
  ${baseSvgStyle}
`;

export const StyledPescetarian = styled(SeafoodLogo)`
  ${baseSvgStyle}
`;

export const StyledPaleo = styled(PaleoDietLogo)`
  ${baseSvgStyle}
`;

export const StyledWhole30 = styled(Whole30Logo)`
  ${baseSvgStyle}
`;

export const StyledAnything = styled(AnythingLogo)`
  ${baseSvgStyle}
`;
