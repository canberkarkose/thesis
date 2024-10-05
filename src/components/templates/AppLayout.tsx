import { useState } from 'react';

import { MainContainer, ContentArea } from './AppLayout.styles';

import { AppHeader } from '@components/organisms/AppHeader/AppHeader';
import { AppSidebar } from '@components/organisms/AppSidebar/AppSidebar';

interface AppLayoutProps {
  children: React.ReactNode;
}

export const AppLayout: React.FC<AppLayoutProps> = ({ children }: AppLayoutProps) => {
  const [isSidebarHovered, setIsSidebarHovered] = useState(false);

  const handleSidebarHoverChange = (isHovered: boolean) => {
    setIsSidebarHovered(isHovered);
  };

  return (
    <>
      <AppHeader />
      <MainContainer>
        <AppSidebar onHoverChange={handleSidebarHoverChange} />
        <ContentArea isSidebarHovered={isSidebarHovered}>
          {children}
        </ContentArea>
      </MainContainer>
    </>
  );
};
