import { useState } from 'react';
import { Outlet } from 'react-router-dom';

import { MainContainer, ContentArea, GlobalBackground } from './AppLayout.styles';

import { AppHeader } from '@components/organisms/AppHeader/AppHeader';
import { AppSidebar } from '@components/organisms/AppSidebar/AppSidebar';

export const AppLayout = () => {
  const [isSidebarHovered, setIsSidebarHovered] = useState(false);

  const handleSidebarHoverChange = (isHovered: boolean) => {
    setIsSidebarHovered(isHovered);
  };

  return (
    <GlobalBackground>
      <AppHeader />
      <AppSidebar onHoverChange={handleSidebarHoverChange} />
      <MainContainer isSidebarHovered={isSidebarHovered}>
        <ContentArea>
          <Outlet />
        </ContentArea>
      </MainContainer>
    </GlobalBackground>
  );
};
