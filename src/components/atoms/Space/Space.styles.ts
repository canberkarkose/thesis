import styled from '@emotion/styled';

type SpaceContainerProps = {
  size: string;
  horizontal: boolean | undefined;
};

export const SpaceContainer = styled.div<SpaceContainerProps>`
  height: ${({ horizontal, size }) => (horizontal ? '1px' : size)};
  width: ${({ horizontal, size }) => (horizontal ? size : '1px')};
`;
