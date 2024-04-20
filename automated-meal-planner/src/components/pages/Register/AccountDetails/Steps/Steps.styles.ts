import styled from '@emotion/styled';

import { Button, ToggleButtonGroup } from '@mui/material';

import { ReactComponent as GlutenFreeLogo } from '../../../../../assets/gluten-free.svg';
import { ReactComponent as KetogenicLogo } from '../../../../../assets/ketogenic.svg';
import { ReactComponent as VegetarianLogo } from '../../../../../assets/vegetarian.svg';
import { ReactComponent as LactoVegetarianLogo } from '../../../../../assets/no-egg.svg';
import { ReactComponent as OvoVegetarianLogo } from '../../../../../assets/dairy-free.svg';
import { ReactComponent as VeganLogo } from '../../../../../assets/vegan.svg';
import { ReactComponent as PescetarianLogo } from '../../../../../assets/seafood.svg';
import { ReactComponent as PaleoLogo } from '../../../../../assets/paleo-diet.svg';
import { ReactComponent as Whole30Logo } from '../../../../../assets/bread.svg';
import { ReactComponent as AnythingLogo } from '../../../../../assets/all.svg';

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
  width: 30px;
  height: 30px;
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

export const StyledLactoVegetarian = styled(LactoVegetarianLogo)`
  ${baseSvgStyle}
`;

export const StyledOvoVegetarian = styled(OvoVegetarianLogo)`
  ${baseSvgStyle}
`;

export const StyledVegan = styled(VeganLogo)`
  ${baseSvgStyle}
`;

export const StyledPescetarian = styled(PescetarianLogo)`
  ${baseSvgStyle}
`;

export const StyledPaleo = styled(PaleoLogo)`
  ${baseSvgStyle}
`;

export const StyledWhole30 = styled(Whole30Logo)`
  ${baseSvgStyle}
`;

export const StyledAnything = styled(AnythingLogo)`
  ${baseSvgStyle}
`;
