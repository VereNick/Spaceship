import React from 'react';
import ReactDOM from 'react-dom';
import styled, { createGlobalStyle } from "styled-components";
import { Fragment } from "react";
import {Header} from "./Components/Header";
import {MainBar} from "./Components/MainBar";
import {SideBar} from "./Components/SideBar";
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

ReactDOM.render(
  <React.StrictMode>
    <App/>
  </React.StrictMode>,
  document.getElementById('root')
);
// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
// reportWebVitals();