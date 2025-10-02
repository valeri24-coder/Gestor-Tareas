import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import "../Componentes/styles/ini.css";
import Encabezado from "../Componentes/Encabezado";

function Sesion() {
  const [usuario, setUsuario] = useState("");
  const [contraseña, setContraseña] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

 const handleSubmit = async (e) => {
  e.preventDefault();

  if (!usuario || !contraseña) {
    setError("Todos los campos son obligatorios");
    return;
  }

  try {
    const response = await fetch("http://localhost:5000/api/inisesion", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({ email: usuario, password: contraseña }),
    });

    const data = await response.json();

    if (data.success) {
      localStorage.setItem("usuario", JSON.stringify(data.data));

      navigate("/tareas");
    } else {
      setError(data.message);
    }
  } catch (err) {
    setError("Error al conectar con el servidor");
    console.error(err);
  }
};


  return (
    <div className="pantalla">
      <div className="arriba">
        <Encabezado />
      </div>

      <div className="abajo">
        <div className="contenedor">
          <form onSubmit={handleSubmit}>
            <h2 className="titulo">INICIAR SESIÓN</h2>
            <input
              type="text"
              placeholder="Usuario (email)"
              value={usuario}
              onChange={(e) => setUsuario(e.target.value)}
            />
            <input
              type="password"
              placeholder="Contraseña"
              value={contraseña}
              onChange={(e) => setContraseña(e.target.value)}
            />
            {error && <p style={{ color: "red" }}>{error}</p>}
            <button type="submit">Ingresar</button>
            <p className="registrar">
              ¿No tienes cuenta? <Link to="/registrar">Regístrate</Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Sesion;
