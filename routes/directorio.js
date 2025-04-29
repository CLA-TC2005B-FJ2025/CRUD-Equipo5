import express from "express";
import sql from "mssql";
import DBconfig from "../src/index.js";

const router = express.Router();

// GET /directorio/profesores/count
router.get("/profesores/count", async (req, res) => {
  try {
    await sql.connect(DBconfig);
    const result = await sql.query(
      `SELECT COUNT(*) AS count FROM profesor;`
    );
    res.json({ count: result.recordset[0].count });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error al contar profesores" });
  }
});

// GET /directorio/directivos/count
router.get("/directivos/count", async (req, res) => {
  try {
    await sql.connect(DBconfig);
    const result = await sql.query(
      `SELECT COUNT(*) AS count
       FROM usuario u
       JOIN permiso p ON u.idUsuario = p.idUsuario_usuario
       WHERE p.idRol_rol = 1`
    );
    res.json({ count: result.recordset[0].count });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error al contar directivos" });
  }
});

// GET /directorio/otros/count
router.get("/otros/count", async (req, res) => {
  try {
    await sql.connect(DBconfig);
    const result = await sql.query(
      `SELECT COUNT(*) AS count
       FROM usuario u
       JOIN permiso p ON u.idUsuario = p.idUsuario_usuario
       WHERE p.idRol_rol = 3`
    );
    res.json({ count: result.recordset[0].count });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error al contar otros usuarios" });
  }
});

// GET /directorio/search?term=
router.get("/search", async (req, res) => {
  try {
    const term = req.query.term || "";
    await sql.connect(DBconfig);
    const request = new sql.Request();
    request.input("term", sql.VarChar(50), `%${term}%`);

    const result = await request.query(
      `SELECT u.idUsuario, u.nombre, u.apellidop, u.apellidom
       FROM usuario u
       WHERE u.nombre + ' ' + u.apellidop + ' ' + u.apellidom LIKE @term`
    );

    const items = result.recordset.map(u => ({
      id: u.idUsuario,
      nombre: `${u.nombre} ${u.apellidop} ${u.apellidom}`
    }));

    res.json({ items });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error en búsqueda de directorio" });
  }
});

export default router;
