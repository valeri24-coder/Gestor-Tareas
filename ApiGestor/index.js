const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql2/promise');
const app = express();
const session = require('express-session');
const path = require('path');
const cors = require('cors');

app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(session({
  secret: 'clave-ultra-secretaa',
  resave: false,
  saveUninitialized: true,
  cookie: {
    secure: true,
    sameSite: 'none'
  }
}));

//configuracion base de datos
const db = {
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'gestortareas'
};
const handleDbError = (error, res) => {
  console.error('Error de base de datos:', error);
  res.status(500).json({
    success: false,
    message: 'Error interno del servidor'
  });
};

//Api registrar
app.post('/api/regisesion', async (req, res) => {
  const { nombre, email, password } = req.body;
  console.log(nombre, email, password)
  if (!nombre || !email || !password) {
    return res.status(400).json({ success: false, message: 'Datos incompletos' });
  }
  let connection;
  try {
    connection = await mysql.createConnection(db);
    const [rows] = await connection.execute(
    'SELECT * FROM usuarios WHERE email = ?',
    [email]
    );
    if (rows.length > 0) {
      return res.status(409).json({ success: false, message: 'Usuario ya existe' });
    }
    await connection.execute(
      `INSERT INTO usuarios (nombre, email, password) VALUES (?, ?, ?)`,
      [nombre, email, password]
    );
    res.status(201).json({
      success: true,
      message: 'Usuario registrado exitosamente',
      data: { nombre, email, password }
    });
  }
  catch (error) {
    handleDbError(error, res);
  } finally {
    if (connection) await connection.end();
  }
})

//api iniciar sesion
app.post('/api/inisesion', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ success: false, message: 'Correo y Contraseña son requeridos' });
  }

  let connection;
  try {
    connection = await mysql.createConnection(db);
    const [rows] = await connection.execute(
      'SELECT * FROM usuarios WHERE email = ? AND password = ?',
      [email, password]
    );
    console.log(rows)
    if (rows.length > 0) {
      const usuario = rows[0];

      req.session.usuario = usuario;
      console.log("Sesión guardada:", req.session.usuario);

      return res.status(200).json({
        success: true,
        message: 'Inicio de sesión exitoso',
        data: usuario,
      });
    } else {
      return res.status(401).json({
        success: false,
        message: 'Usuario no encontrado',
      });
    }
  } catch (error) {
    console.error('Error al iniciar sesión:', error);
    return res.status(500).json({
      success: false,
      message: 'Error del servidor',
    });
  } finally {
    if (connection) await connection.end();
  }
});

//Obtener todas las tareas
app.get('/api/tareas', async (req, res) => {
  let connection;
  try {
    connection = await mysql.createConnection(db);
    const [tareas] = await connection.execute(`
      SELECT tareas.id, tareas.titulo, tareas.descripcion, tareas.estado, tareas.fecha_creacion, usuarios.nombre AS nombre_usuario
      FROM tareas
      INNER JOIN usuarios ON tareas.usuario_id = usuarios.id
    `);
    res.json({ success: true, data: tareas });
  } catch (error) {
    console.error('Error al obtener tareas:', error);
    res.status(500).json({ success: false, message: 'Error al obtener tareas' });
  } finally {
    if (connection) await connection.end();
  }
});

//Obtener las tareas por id
app.get('/api/tareas/:id', async (req, res) => {
  const { id } = req.params;
  let connection;
  try {
    connection = await mysql.createConnection(db);
    const [rows] = await connection.execute(`
      SELECT tareas.id, tareas.titulo, tareas.descripcion, tareas.estado, tareas.fecha_creacion, usuarios.nombre AS nombre_usuario
      FROM tareas
      INNER JOIN usuarios ON tareas.usuario_id = usuarios.id
      WHERE tareas.id = ?
    `, [id]);

    if (rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Tarea no encontrada' });
    }

    res.json({ success: true, data: rows[0] });
  } catch (error) {
    console.error('Error al obtener tarea:', error);
    res.status(500).json({ success: false, message: 'Error al obtener tarea' });
  } finally {
    if (connection) await connection.end();
  }
});

//Agregar tarea
app.post('/api/tareas', async (req, res) => {
  const { usuario_id, titulo, descripcion, estado } = req.body;

  if (!usuario_id || !titulo || !descripcion || !estado) {
    return res.status(400).json({ success: false, message: 'Todos los campos son obligatorios' });
  }

  let connection;
  try {
    connection = await mysql.createConnection(db);
    await connection.execute(`
      INSERT INTO tareas (usuario_id, titulo, descripcion, estado, fecha_creacion)
      VALUES (?, ?, ?, ?, NOW())
    `, [usuario_id, titulo, descripcion, estado]);

    res.json({ success: true, message: 'Tarea agregada exitosamente' });
  } catch (error) {
    console.error('Error al agregar tarea:', error);
    res.status(500).json({ success: false, message: 'Error al agregar tarea' });
  } finally {
    if (connection) await connection.end();
  }
});

//Editar tarea
app.put('/api/tareas/:id', async (req, res) => {
  const { id } = req.params;
  const { titulo, descripcion, estado } = req.body;

  if (!titulo || !descripcion || !estado) {
    return res.status(400).json({ success: false, message: 'Todos los campos son obligatorios' });
  }

  let connection;
  try {
    connection = await mysql.createConnection(db);
    await connection.execute(`
      UPDATE tareas
      SET titulo = ?, descripcion = ?, estado = ?
      WHERE id = ?
    `, [titulo, descripcion, estado, id]);

    res.json({ success: true, message: 'Tarea actualizada exitosamente' });
  } catch (error) {
    console.error('Error al actualizar tarea:', error);
    res.status(500).json({ success: false, message: 'Error al actualizar tarea' });
  } finally {
    if (connection) await connection.end();
  }
});

//Eliminar tarea
app.delete('/api/tareas/:id', async (req, res) => {
  const { id } = req.params;
  let connection;
  try {
    connection = await mysql.createConnection(db);
    await connection.execute('DELETE FROM tareas WHERE id = ?', [id]);
    res.json({ success: true, message: 'Tarea eliminada' });
  } catch (error) {
    console.error('Error al eliminar tarea:', error);
    res.status(500).json({ success: false, message: 'Error al eliminar tarea' });
  } finally {
    if (connection) await connection.end();
  }
});

//Obtener las tareas segun el usuario.
app.get('/api/tareas/usuario/:usuario_id', async (req, res) => {
  const { usuario_id } = req.params;
  let connection;
  try {
    connection = await mysql.createConnection(db);
    const [tareas] = await connection.execute(`
      SELECT id, titulo, descripcion, estado, fecha_creacion
      FROM tareas
      WHERE usuario_id = ?
    `, [usuario_id]);

    res.json({ success: true, data: tareas });
  } catch (error) {
    console.error('Error al obtener tareas por usuario:', error);
    res.status(500).json({ success: false, message: 'Error al obtener tareas del usuario' });
  } finally {
    if (connection) await connection.end();
  }
});

app.listen(5000, () => { });