import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom"; 
import Sesion from "./Paginas/Sesion.jsx";
import Registrar from "./Paginas/Registrar.jsx";
import Tareas from "./Paginas/Tareas.jsx"

function App() {
  return (
       <Router>
      <Routes>
        <Route path="/" element={<Sesion />} />
        <Route path="/registrar" element={<Registrar />} />
        <Route path="/tareas" element={<Tareas />} />
      </Routes>
    </Router>
  );
}

export default App;

