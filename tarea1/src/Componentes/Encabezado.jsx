import React from "react";
import { Typewriter } from "react-simple-typewriter"
import logo from "../Img/logo.png"
import "./styles/enca.css";
function Encabezado() {
  return (
    <div className="top">
      <img
        src={logo}
        alt="logo"
        className="logo"
      />
      <h1 className="titulo-encabezado">
        <Typewriter
            words={['CheckMate']}
            loop={Infinity}
            cursor
            cursorStyle=''
            typeSpeed={70}
            deleteSpeed={50}
            delaySpeed={1000}
            />

      </h1>
    </div>
  );
}

export default Encabezado;
