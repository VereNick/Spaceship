import { createRef, useEffect } from "react";
import styled from "styled-components";
import StartGame from "./game";
var CanvStyle = styled.canvas`
    position: absolute;
    background-color: black;
    width: 150vmin;
    height: 100vmin;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    /* background: linear-gradient(90deg, rgba(2,0,36,1) 0%, rgba(104,104,221,1) 90%, rgba(122,120,228,1) 100%); */
`;
const Game = () => {
    var canvasRef = createRef();
    useEffect(() => {
        StartGame(canvasRef.current);
    }, [canvasRef]);
    return <CanvStyle ref = {canvasRef} width = "500" height = "500"></CanvStyle>;
}
export {Game};