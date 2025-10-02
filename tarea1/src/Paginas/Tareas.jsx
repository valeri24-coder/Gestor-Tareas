import React, { useState, useEffect } from "react";
import Encabezado from "../Componentes/Encabezado";
import { AiTwotoneEdit } from "react-icons/ai";
import { FaRegTrashAlt } from "react-icons/fa";
import "../Componentes/styles/tareas.css";
import axios from "axios";

function Tareas() {
  const [tareas, setTareas] = useState([]);
  const [tareaEditando, setTareaEditando] = useState(null);
  const [tituloEdit, setTituloEdit] = useState("");
  const [descripcionEdit, setDescripcionEdit] = useState("");
  const [estadoEdit, setEstadoEdit] = useState("pendiente");

  const [mostrarModalAgregar, setMostrarModalAgregar] = useState(false);
  const [mostrarModalEdicion, setMostrarModalEdicion] = useState(false);

  const [tituloNueva, setTituloNueva] = useState("");
  const [descripcionNueva, setDescripcionNueva] = useState("");

  useEffect(() => {
    obtenerTareas();
  }, []);

  const obtenerTareas = async () => {
    try {
      const usuario = JSON.parse(localStorage.getItem("usuario"));
      if (!usuario) {
        console.error("No hay usuario logueado");
        return;
      }
      const res = await axios.get(`http://localhost:5000/api/tareas/usuario/${usuario.id}`);
      setTareas(res.data.data);
    } catch (error) {
      console.error("Error al obtener tareas", error);
    }
  };

  const guardarNuevaTarea = async () => {
    const usuario = JSON.parse(localStorage.getItem("usuario"));
    if (!usuario) {
      alert("Debes iniciar sesión para agregar tareas");
      return;
    }

    try {
      await axios.post("http://localhost:5000/api/tareas", {
        usuario_id: usuario.id,
        titulo: tituloNueva,
        descripcion: descripcionNueva,
        estado: "pendiente",
      });
      setTituloNueva("");
      setDescripcionNueva("");
      setMostrarModalAgregar(false);
      obtenerTareas();
    } catch (error) {
      console.error("Error al agregar tarea", error);
    }
  };

  const eliminarTarea = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/tareas/${id}`);
      obtenerTareas();
    } catch (error) {
      console.error("Error al eliminar tarea", error);
    }
  };

  const abrirModalEdicion = (tarea) => {
    setTareaEditando(tarea);
    setTituloEdit(tarea.titulo);
    setDescripcionEdit(tarea.descripcion);
    setEstadoEdit(tarea.estado);
    setMostrarModalEdicion(true);
  };

  const guardarEdicion = async () => {
    try {
      await axios.put(`http://localhost:5000/api/tareas/${tareaEditando.id}`, {
        titulo: tituloEdit,
        descripcion: descripcionEdit,
        estado: estadoEdit,
      });
      setMostrarModalEdicion(false);
      setTareaEditando(null);
      obtenerTareas();
    } catch (error) {
      console.error("Error al editar tarea", error);
    }
  };

  return (
    <div className="pantalla">
      <div className="arriba">
        <Encabezado />
      </div>

      <div className="todo">
        <div className="abajo">
          <div className="tareas">
            {tareas.map((t) => (
              <div key={t.id} className="tarjeta">
                <h3>{t.titulo}</h3>
                <p>{t.descripcion}</p>
                <small>Estado: {t.estado || "pendiente"}</small>
                <div className="acciones-tarjeta">
                  <button onClick={() => eliminarTarea(t.id)}>
                    <FaRegTrashAlt />
                  </button>
                  <button onClick={() => abrirModalEdicion(t)}>
                    <AiTwotoneEdit />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="nueva-tarea">
          <button onClick={() => setMostrarModalAgregar(true)}>+ Nueva Tarea</button>
        </div>
      </div>

      
      {mostrarModalEdicion && tareaEditando && (
        <div className="modal">
          <div className="modal-contenido">
            <h2>Editar tarea</h2>
            <input
              type="text"
              value={tituloEdit}
              onChange={(e) => setTituloEdit(e.target.value)}
            />
            <textarea
              value={descripcionEdit}
              onChange={(e) => setDescripcionEdit(e.target.value)}
            />
            <label>Estado:</label>
            <select
              value={estadoEdit}
              onChange={(e) => setEstadoEdit(e.target.value)}
            >
              <option value="pendiente">Pendiente</option>
              <option value="completada">Completada</option>
            </select>
            <div className="acciones-modal">
              <button onClick={guardarEdicion}>Guardar</button>
              <button onClick={() => { setTareaEditando(null); setMostrarModalEdicion(false); }}>
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}

      
      {mostrarModalAgregar && (
        <div className="modal">
          <div className="modal-contenido">
            <h2>Nueva tarea</h2>
            <input
              type="text"
              value={tituloNueva}
              onChange={(e) => setTituloNueva(e.target.value)}
              placeholder="Título"
            />
            <textarea
              value={descripcionNueva}
              onChange={(e) => setDescripcionNueva(e.target.value)}
              placeholder="Descripción"
            />
            <div className="acciones-modal">
              <button onClick={guardarNuevaTarea}>Guardar</button>
              <button onClick={() => setMostrarModalAgregar(false)}>Cancelar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Tareas;
