import styled from '@emotion/styled';

import backgroundImage from '@src/assets/background.png';

interface MainContainerProps {
  isSidebarHovered: boolean;
}

export const GlobalBackground = styled.div`
  background-image: url(${backgroundImage});
  background-position: center;
  background-color: rgba(255, 255, 255, 0.5);
  background-blend-mode: overlay;
  position: relative;
  height: 100vh;
  overflow: hidden;
`;

export const AppHeader = styled.header`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 60px;
  z-index: 1000;
`;

export const AppSidebar = styled.aside<MainContainerProps>`
  position: fixed;
  top: 60px; /* Same as header height */
  left: 0;
  width: ${(props) => (props.isSidebarHovered ? '200px' : '60px')};
  height: calc(100vh - 60px);
  transition: width 0.3s ease;
  z-index: 999;
`;

export const MainContainer = styled.div<MainContainerProps>`
  margin-left: ${(props) => (props.isSidebarHovered ? '200px' : '60px')};
  margin-top: 60px;
  height: calc(100vh - 60px);
  overflow: auto;
  transition: margin-left 0.3s ease;
`;

export const ContentArea = styled.main`
  padding-left: 30px;
  padding-right: 30px;
  padding-top: 60px;
  padding-bottom: 35px;
  height: 100%;
  overflow-y: auto;
`;
