import express from "express";
import sql from "mssql";
import DBconfig from "../src/index.js";

const router = express.Router();

// GET /comentarios/count -> número total de comentarios
router.get("/comentarios/count", async (req, res) => {
  try {
    await sql.connect(DBconfig);
    const result = await sql.query(`
      SELECT COUNT(*) AS count
      FROM comentario;
    `);
    res.json({ count: result.recordset[0].count });
  } catch (err) {
    console.error("Error al contar comentarios:", err);
    res.status(500).json({ error: "Error al contar comentarios" });
  }
});

// GET /materias/count -> número total de materias
router.get("/materias/count", async (req, res) => {
  try {
    await sql.connect(DBconfig);
    const result = await sql.query(`
      SELECT COUNT(*) AS count
      FROM materia;
    `);
    res.json({ count: result.recordset[0].count });
  } catch (err) {
    console.error("Error al contar materias:", err);
    res.status(500).json({ error: "Error al contar materias" });
  }
});

export default router;
