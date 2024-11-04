import styled from '@emotion/styled';

interface ContentAreaProps {
  isSidebarHovered: boolean;
}

export const MainContainer = styled.div`
  display: flex;
  margin-top: 100px; /* Adjust based on header height */
`;

export const ContentArea = styled.main<ContentAreaProps>`
  flex-grow: 1;
  padding: 20px;
  margin-left: ${(props) => (props.isSidebarHovered ? '200px' : '60px')};
  transition: margin-left 0.3s ease;
`;
