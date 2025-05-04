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

  // GET /comentarios/detalle?matriculaMaestro=...&claveMateria=...
router.get("/detalle", async (req, res) => {
  const { matriculaMaestro, claveMateria } = req.query;
  if (!matriculaMaestro || !claveMateria) {
    return res.status(400).json({ error: "matriculaMaestro y claveMateria requeridos" });
  }

  try {
    await sql.connect(DBconfig);
    const request = new sql.Request();
    request.input("mm", sql.VarChar(10), matriculaMaestro);
    request.input("clave", sql.VarChar(15), claveMateria);

    const result = await request.query(`
      SELECT 
        c.idComentario,
        c.comentario,
        c.matriculaAlumno_alumno AS matriculaAlumno,
        a.nombre + ' ' + a.apellidoPaterno + ' ' + a.apellidoMaterno AS nombreAlumno
      FROM comentario c
      JOIN grupo g ON c.crn = g.crn
      JOIN materia m ON g.clave_materia = m.clave
      LEFT JOIN alumno a ON c.matriculaAlumno_alumno = a.matriculaAlumno
      WHERE g.matriculaMaestro_profesor = @mm
        AND g.clave_materia = @clave
      ORDER BY c.idComentario DESC;
    `);

    res.json({ comentarios: result.recordset });
  } catch (err) {
    console.error("Error en detalle de comentarios:", err);
    res.status(500).json({ error: "Error interno al obtener comentarios" });
  }
});


export default router;
