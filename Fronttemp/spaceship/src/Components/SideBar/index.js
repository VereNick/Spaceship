import styled, { createGlobalStyle } from "styled-components";
import { Component, Fragment } from "react";
import { Link } from "react-router-dom";
const SideBarer = styled.ul`
  background-color: lightgoldenrodyellow;
  width: 20vw;
  height: 100vh;
  margin: 0;
  display: flex;
  box-sizing: border-box;
  flex-direction: column;
  & li{
    margin-top: 8px;
    display: block;
    font-family: Verdana, Geneva, Tahoma, sans-serif;
    & button{
      border-radius: 10%;
    }
  }
`;
const SideBar = () => {
  var res = new Array(1);
  res.fill(1);
  return (<SideBarer>
    {res.map((cur) => {
      return <li><Link to = "/game/">{cur}</Link></li>;
    })}
  </SideBarer>);
};
export {SideBar};