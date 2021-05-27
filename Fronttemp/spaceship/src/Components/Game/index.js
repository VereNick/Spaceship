import styled, { createGlobalStyle } from "styled-components";
import { Component, Fragment, createRef, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import StartGame from "./game";
const Game = () => {
    var canvasRef = createRef();
    useEffect(() => {
        StartGame(canvasRef.current);
    }, []);
    return <canvas ref = {canvasRef} width = "500" height = "500"></canvas>;
}
export {Game};