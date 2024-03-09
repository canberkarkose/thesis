import styled from '@emotion/styled';

export const HeaderContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #36454F;
  padding: 0 20px;
  height: 120px;
`;

export const LogoContainer = styled.div`
  display: flex;
  align-items: center;
  width: 90pt;
  height: 100pt;
  padding-top: 22px;
`;

export const LogoTitleContainer = styled.div`
  display: flex;
  align-items: center;
  padding-left: 80px;
`;

export const WebsiteTitle = styled.h1`
  font-size: 20px;
  font-weight: bold;
  font-family: 'Outfit', sans-serif;
  margin: 0;
  line-height: 1.2;
  color: white;
`;

export const NavigationLinks = styled.div`
  display: flex;
  gap: 20px;
  padding-right: 100px;
  font-size: 18px;
  font-weight: semi-bold;
`;

export const NavLink = styled.a`
  color: white;
  font-family: 'Outfit', sans-serif;
  text-decoration: none;
  cursor: pointer;
  &:hover {
    text-decoration: underline;
  }
`;
