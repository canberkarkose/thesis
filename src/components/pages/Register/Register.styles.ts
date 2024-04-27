import styled from '@emotion/styled';

export const ContentContainer = styled.div`
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #ECFAF4;
  width: 50%;
  max-width: 1000px;
  margin: 0 auto;
  padding: 20px;
  position: relative;
  @media (min-width: 1600px) {
    max-width: 1300px;
    padding: 40px;
  }
`;
