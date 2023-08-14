import styled from "styled-components";

export const Container = styled.div<{ $darkMode: boolean }>`
  background-color: ${(props) => (props.$darkMode ? "#242424" : "#ebebeb")};
  color: ${(props) => (props.$darkMode ? "#ebebeb" : "#242424")};
  width: 100%;
  height: 100vh;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  flex-direction: column;
`;

export const Video = styled.video`
  padding: 20px;
  background-color: #fefefe;
  box-shadow: 6px 6px 7px -4px rgba(0, 0, 0, 0.75);
`;
