import express from "express";
import sql from "mssql";
import DBconfig from "../src/index.js"; 
//import mysql from "mysql"; 

const router = express.Router();

// Configuración de conexión a MySQL
const conexion = mysql.createConnection({
  host: 'localhost',
  user: 'tu_usuario',
  password: 'tu_contraseña',
  database: 'tu_base_de_datos'
});

router.post("/subir-encuestas", async (req, res) => {
  try {
    const encuestas = req.body.encuestas;

    if (!encuestas || !Array.isArray(encuestas)) {
      return res.status(400).json({ error: "Datos inválidos" });
    }

    encuestas.forEach(encuesta => {
      const { Matricula, Grupo, Comentarios, Profesor, Clase, Departamento } = encuesta;
      req.send (Matricula, Grupo, Comentarios, Profesor, Clase, Departamento );
      console.log (Matricula, Grupo, Comentarios, Profesor, Clase, Departamento );

      //const query = 'INSERT INTO encuesta (matricula, grupo, comentarios, profesor, clase, departamento) VALUES (?, ?, ?, ?, ?, ?)';
      //const valores = [Matricula, Grupo, Comentarios, Profesor, Clase, Departamento];

      //conexion.query(query, valores, (error, resultados) => {
        //if (error) {
          //console.error("Error al insertar encuesta:", error);
          // Deberíamos responder 500 si hay error
          //return res.status(500).json({ error: "Error al insertar encuesta" });
        //}
      //});
    });

    res.status(201).json({ mensaje: "Encuestas recibidas exitosamente" });
  } catch (error) {
    console.error("Error interno:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
});


// Ruta de prueba
router.get("/prueba", (req, res) => {
  res.json({ mensaje: "¡Servidor funcionando correctamente!" });
});

export default router;
