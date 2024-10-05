// src/components/AppSidebar/AppSidebar.tsx

import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import {
  Dashboard as DashboardIcon,
  CalendarToday as MealPlannerIcon,
  ShoppingCart as GroceryIcon,
  RestaurantMenu as RecipesIcon,
} from '@mui/icons-material';

import {
  SidebarContainer,
  SidebarWrapper,
  SidebarItemButton,
  SidebarIcon,
  SidebarText,
} from './AppSidebar.styles';

interface AppSidebarProps {
  onHoverChange: (isHovered: boolean) => void;
}

export const AppSidebar: React.FC<AppSidebarProps> = ({ onHoverChange }: AppSidebarProps) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseEnter = () => {
    setIsHovered(true);
    onHoverChange(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    onHoverChange(false);
  };

  const menuItems = [
    { text: 'Dashboard', icon: <DashboardIcon />, path: '/app/dashboard' },
    { text: 'Meal Planner', icon: <MealPlannerIcon />, path: '/app/meal-planner' },
    { text: 'Grocery List', icon: <GroceryIcon />, path: '/app/grocery-list' },
    { text: 'Recipes', icon: <RecipesIcon />, path: '/app/recipes' },
  ];

  const handleNavigation = (path: string) => {
    navigate(path);
  };

  return (
    <SidebarContainer
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      isHovered={isHovered}
    >
      <SidebarWrapper isHovered={isHovered}>
        {menuItems.map((item) => (
          <SidebarItemButton
            key={item.text}
            onClick={() => handleNavigation(item.path)}
            selected={location.pathname === item.path}
            isHovered={isHovered}
          >
            <SidebarIcon>{item.icon}</SidebarIcon>
            <SidebarText isHovered={isHovered}>{item.text}</SidebarText>
          </SidebarItemButton>
        ))}
      </SidebarWrapper>
    </SidebarContainer>
  );
};
