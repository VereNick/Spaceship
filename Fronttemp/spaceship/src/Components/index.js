import styled, { createGlobalStyle } from "styled-components";
import { Fragment } from "react";
const Headerer = styled.div`
  background-color: green;
  width: 70vw;
  height: 10vh;
`;
function Header() {
    return {Headerer};
}
export {Header};