import styled from "styled-components";

export const Container = styled.div<{ $darkMode: boolean }>`
  background-color: ${(props) => (props.$darkMode ? "#242424" : "#ebebeb")};
  color: ${(props) => (props.$darkMode ? "#ebebeb" : "#242424")};
  width: 100%;
  min-height: 100vh;
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

export const ImageContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  grid-gap: 40px;
  margin: 40px;
`;

export const ImageShell = styled.div`
  position: relative;
`;

export const ImageCounterBadge = styled.div`
  position: absolute;
  bottom: -11px;
  right: -17px;
  width: 30px;
  height: 30px;
  border-radius: 100px;
  background-color: black;
  color: white;
  font-size: 1rem;
  display: flex;
  justify-content: center;
  align-items: center;
`;
