import DBconfig from "../src/index.js";
import express from "express";
import sql from "mssql";
import bcrypt from "bcrypt";

const router = express.Router();

router.post("/", async (req, res) => {
  const { email, password, rol } = req.body;
  console.log(email, password, rol, " CREEDENCIALES");
  try {
    await sql.connect(DBconfig);
    let transaction = new sql.Transaction();
    await transaction.begin();

    const request = new sql.Request(transaction);
    request.input("correo", sql.VarChar, email);
    const person = await request.query(
      "SELECT * FROM usuario WHERE correo = @correo",
    );

    if (person.recordset.length) {
      request.input(
        "idForm",
        sql.VarChar,
        String(person.recordset[0].idUsuario),
      );
      request.input("rolForm", sql.Int, parseInt(rol));

      const match = await bcrypt.compare(
        password,
        person.recordset[0].contraseñaHash,
      );
      if (match) {
        const permiso = await request.query(
          "SELECT * FROM permiso WHERE idUsuario_usuario = @idForm AND idRol_rol = @rolForm",
        );
        if (permiso.recordset.length) {
          console.log("Contraseña y permisos correctos");
          res.send(true);
        } else {
          console.log(
            "Contraseña correcta, pero no se cuentan con los permisos necesarios",
          );
          res.send(false);
        }
      } else {
        res.status(401).send("Credenciales inválidas aqui");
      }
    } else {
      res.status(401).send("Credenciales inválidas o aqui?");
    }

    await transaction.commit();
  } catch (err) {
    console.error(err);
    if (transaction) await transaction.rollback();
    res.status(500).send("Error interno del servidor");
  } finally {
    sql.close();
  }
});

export default router;
