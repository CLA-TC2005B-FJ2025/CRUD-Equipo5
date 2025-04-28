import express from "express";
import sql from "mssql";
import DBconfig from "../src/index.js"; 

const router = express.Router();

router.post("/subir", async (req, res) => {
  try {
    const encuestas = req.body.encuestas;
    const prueba = [];

    if (!encuestas || !Array.isArray(encuestas)) {
      return res.status(400).json({ error: "Datos inválidos" });
    }

    encuestas.forEach(encuesta => {
      // Campos normales
      const { Matricula, Grupo, Comentarios, Profesor, Clase, Departamento } = encuesta;

      // Detectamos preguntas (todo lo que no es Matricula, Grupo, etc.)
      const camposSistema = ["Matricula", "Grupo", "Comentarios", "Profesor", "Clase", "Departamento"];
      const preguntas = [];

      Object.keys(encuesta).forEach(key => {
        if (!camposSistema.includes(key) && encuesta[key] !== undefined && encuesta[key] !== '') {
          preguntas.push({ pregunta: key, respuesta: encuesta[key] });
        }
      });

      prueba.push({
        Matricula,
        Grupo,
        Comentarios,
        Profesor,
        Clase,
        Departamento,
        preguntas
      });
    });

    console.log(JSON.stringify(prueba, null, 2));
    res.status(201).send("Encuestas recibidas exitosamente");

  } catch (error) {
    console.error("Error interno:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

router.get("/subir", async (req,res) => {
  res.send("made it");
});

router.get("/prueba", (req, res) => {
  res.json({ mensaje: "¡Servidor funcionando correctamente!" });
});

export default router;
