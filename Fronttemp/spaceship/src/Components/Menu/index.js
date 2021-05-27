import styled, { createGlobalStyle } from "styled-components";
import {Header} from "../Header";
import {MainBar} from "../MainBar";
import {SideBar} from "../SideBar";
const FlexDiv = styled.div`
    display: flex;
`;
const Menu = () => (
  <FlexDiv>
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
export {Menu};