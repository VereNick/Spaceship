import styled, { createGlobalStyle } from "styled-components";
import { Fragment } from "react";
import {Header} from "../Header";
const GlobalStyle = createGlobalStyle`
    body{
        margin: 0;
        padding: 0;
    }
`;
const FlexDiv = styled.div`
    display: flex;
`;
const App = () => (
  <FlexDiv>
    <GlobalStyle />
    <div>
      <Header>
      </Header>
      <MainBar>
      </MainBar>
    </div>
    <SideBar>
    </SideBar>
  </FlexDiv>
);
export { App };
