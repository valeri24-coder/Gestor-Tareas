import React, { useState } from "react";
import { Link } from "react-router-dom";
import Encabezado from "../Componentes/Encabezado";

function Registrar() {
  const [nombre, setNombre] = useState("");
  const [usuario, setUsuario] = useState(""); // Aquí va el correo
  const [contraseña, setContraseña] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!nombre || !usuario || !contraseña) {
      alert("Por favor, completa todos los campos.");
      return;
    }

     try {
      const response = await fetch("http://localhost:5000/api/regisesion", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include", 
        body: JSON.stringify({
          nombre: nombre,
          email: usuario, 
          password: contraseña,
        }),
      });

      const data = await response.json();
      console.log("Respuesta del servidor:", data);

      if (data.success) {
        alert("Registro exitoso");
        setNombre("");
        setUsuario("");
        setContraseña("");
      } else {
        alert("Error: " + data.message);
      }
    } catch (error) {
      console.error("Error al registrar:", error);
      alert("Ocurrió un error al registrar.");
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
            <h2 className="titulo">Registro</h2>

            <input
              type="text"
              placeholder="Nombre completo"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              required
            />

            <input
              type="email"
              placeholder="Correo electrónico"
              value={usuario}
              onChange={(e) => setUsuario(e.target.value)}
              required
            />

            <input
              type="password"
              placeholder="Contraseña"
              value={contraseña}
              onChange={(e) => setContraseña(e.target.value)}
              required
            />

            <button type="submit">Registrarme</button>

            <p>¿Ya tienes una cuenta? <Link to="/login">Inicia sesión aquí</Link></p>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Registrar;