import styled from '@emotion/styled';

export const HeaderContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #3c6e57;
  padding: 0 2vw;
  height: 14vh;

  @media (max-width: 768px) {
    flex-direction: column;
    height: auto;
    padding: 2vh 4vw;
  }
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

  @media (max-width: 768px) {
    flex-direction: column;
    padding-left: 0;
    align-items: center;
    text-align: center;
  }
`;

export const WebsiteTitle = styled.h1`
  font-size: 20px;
  font-weight: bold;
  margin: 0;
  line-height: 1.2;
  color: white;
`;

export const NavigationLinks = styled.div`
  display: flex;
  gap: 20px;
  padding-right: 100px;

  @media (max-width: 768px) {
    flex-direction: column;
    padding-right: 0;
    align-items: center;
    gap: 10px;
  }
`;

export const NavLink = styled.a`
  color: white;
  text-decoration: none;
  cursor: pointer;
  &:hover {
    text-decoration: underline;
  }

  @media (max-width: 768px) {
    font-size: 16px;
  }
`;
