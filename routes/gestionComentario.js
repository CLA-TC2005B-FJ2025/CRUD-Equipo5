import express from "express";
import sql from "mssql";
import DBconfig from "../src/index.js";

const router = express.Router();

// GET /comentarios/gestion?matriculaMaestro=...
// Devuelve por materia: nombreMateria, total, filtrados, eliminados
router.get("/gestion", async (req, res) => {
    try {
      const mm = req.query.matriculaMaestro;
      if (!mm) {
        return res.status(400).json({ error: "matriculaMaestro requerida" });
      }
  
      await sql.connect(DBconfig);
      const request = new sql.Request();
      request.input("mm", sql.VarChar(10), mm);
  
      const result = await request.query(`
        SELECT
          m.nombreMateria AS nombre,
          COUNT(c.idComentario) AS total
        FROM comentario c
        JOIN grupo g ON c.crn = g.crn
        JOIN materia m ON g.clave_materia = m.clave
        WHERE g.matriculaMaestro_profesor = @mm
        GROUP BY m.nombreMateria;
      `);
  
      const materias = result.recordset.map(r => ({
        nombre: r.nombre,
        total: r.total,
        filtrados: 0,
        eliminados: 0
      }));
  
      res.json({ materias });
    } catch (err) {
      console.error("Error en gestion de comentarios:", err);
      res.status(500).json({ error: "Error interno al gestionar comentarios" });
    }
  });

export default router;
