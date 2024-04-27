import styled from '@emotion/styled';
import { AppBar, Typography } from '@mui/material';

export const HeaderContainer = styled(AppBar)`
  background-color: #3C4C3D;
  height: 100px;
  z-index: 1000;
  position: fixed;
  width: 100%;
  top: 0;
`;

export const HeaderContent = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 100%;
`;

export const AccountActions = styled.div`
  display: flex;
  align-items: center;
  color: white;
  margin-right: 2%;
`;

export const LogoContainer = styled.div`
  display: flex;
  align-items: center;
  flex-grow: 0;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  margin-top: 1.3%;
  margin-left: 40%;
  svg {
    width: 100px;
    height: auto;
  }
`;

export const LogoText = styled(Typography)`
  font-weight: bold;
  font-size: 1.5rem;
  color: white;
  margin-left: 10px;
  margin-bottom: 5%;
`;
