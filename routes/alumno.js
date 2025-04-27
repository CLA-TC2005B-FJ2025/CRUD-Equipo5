import DBconfig from "../src/index.js";
import express from "express";
import sql from "mssql";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    await sql.connect(DBconfig);
    const result = await sql.query("SELECT * FROM usuario"); //cambie esto para reciclarlo jajaj pero es nomas para development
    res.send(result.recordset);
  } catch (err) {
    console.error(err);
  }
});

router.get("/:matriculaAlumno", async (req, res) => {
  let transaction;
  try {
    await sql.connect(DBconfig);
    const idQuery = req.params.matriculaAlumno;

    if (!idQuery) {
      res.send("ID NO VALIDO");
    } else {
      transaction = new sql.Transaction();
      await transaction.begin();
      const request = new sql.Request(transaction);
      request.input("matriculaAlumno", sql.VarChar, idQuery);

      const result = await request.query(
        "SELECT * FROM alumno WHERE matriculaAlumno = @matriculaAlumno",
      );
      if (result.recordset.length) {
        res.send(result.recordset);
      } else {
        res.send("EL ID NO EXISTE");
      }
      await transaction.commit();
    }
  } catch (error) {
    console.error("No se ejecuto la transaccion:", error);
    await transaction.rollback();
  } finally {
    sql.close();
  }
});

router.post("/", async (req, res) => {
  let transaccion;
  try {
    await sql.connect(DBconfig);
    const nuevoAlumno = req.body;
    res.send(
      `Agregando al alumno: ${nuevoAlumno.nombre} ${nuevoAlumno.apellidoPaterno}, con matrícula: ${nuevoAlumno.matriculaAlumno}`,
    );
    transaccion = new sql.Transaction();
    await transaccion.begin();

    const request = transaccion.request();
    request.input("matriculaAlumno", sql.VarChar, nuevoAlumno.matriculaAlumno);
    request.input("nombre", sql.VarChar, nuevoAlumno.nombre);
    request.input("apellidoPaterno", sql.VarChar, nuevoAlumno.apellidoPaterno);
    request.input("apellidoMaterno", sql.VarChar, nuevoAlumno.apellidoMaterno);

    await request.query(
      "INSERT INTO alumno (matriculaAlumno, nombre, apellidoPaterno, apellidoMaterno) VALUES (@matriculaAlumno, @nombre, @apellidoPaterno, @apellidoMaterno)",
    );
    await transaccion.commit();
    console.log("Alumno agregado exitosamente");
  } catch (err) {
    console.error(err);
    if (transaccion) {
      transaccion.rollback();
    }
  } finally {
    sql.close();
  }
});

export default router;
