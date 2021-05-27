import { createGlobalStyle } from "styled-components";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import { Menu } from "../Menu";
import { Game } from "../Game";
import { Fragment } from "react";
const GlobalStyle = createGlobalStyle`
    body{
        margin: 0;
        padding: 0;
        overflow: hidden;
    }
`;
const App = () => (
  <Fragment>
    <GlobalStyle />
    <Router>
      <Switch>
        <Route path="/game/">
          <Game/>
        </Route>
        <Route path="/">
          <Menu />
        </Route>
      </Switch>
    </Router>
  </Fragment>
);
export { App };
