import express from "express";
import sql from "mssql";
import DBconfig from "../src/index.js";

const router = express.Router();

router.post("/subir", async (req, res) => {
  try {
    const encuestas = req.body.encuestas;
    if (!Array.isArray(encuestas)) {
      return res.status(400).json({ error: "Datos inválidos" });
    }

    const camposSistema = [
      "Matricula", "Grupo",
      "Comentarios", "Profesor",
      "Clase", "Departamento"
    ];

    const procesadas = encuestas.map(encuesta => {
      // valores base
      const base = {};
      camposSistema.forEach(campo => {
        base[campo] = (encuesta[campo] || "").toString().trim();
      });

      // preguntas dinámicas
      const preguntas = Object.entries(encuesta)
        .filter(([clave, valor]) =>
          !camposSistema.includes(clave) &&
          valor != null &&
          valor.toString().trim() !== ""
        )
        .map(([clave, valor]) => ({
          pregunta: clave.trim(),
          respuesta: valor.toString().trim(),
        }));

      return { ...base, preguntas };
    });

    console.log(JSON.stringify(procesadas, null, 2));
    // aquí podrías insertarlas en BD usando `mssql`…

    res.status(201).send("Encuestas recibidas exitosamente");
  } catch (error) {
    console.error("Error interno:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

export default router;
