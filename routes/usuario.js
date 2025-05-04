import DBconfig from "../src/index.js";
import bcrypt from "bcrypt";
import express from "express";
import sql from "mssql";

const router = express.Router();

const usuarioTienePermiso = async (idUser, idRol) => {
  /* dentro de esta funcion quiero revisar si existe un id con el permiso
    que se le quiere dar, sisi, pues no deberiamos de darlo de alta para evitar
    sobreescribir (si existe el usario con dicho permiso ya) */
  try {
    await sql.connect(DBconfig);

    const request = new sql.Request();
    const user = await request
      .input("usuario", sql.Int, idUser)
      .input("rol", sql.Int, idRol)
      .query(
        `SELECT * FROM permiso WHERE idUsuario_usuario = @usuario AND idRol_rol = @rol`,
      );
    if (user.recordsets[0].length) {
      console.log(
        `El usuario con ID ${idUser} YA cuenta con los permisos de tipo ${idRol}`,
      );
      return true;
    } else {
      console.log(
        `Agregando los permisos ${idRol} al usuario con ID ${idUser}`,
      );
      return false;
    }
  } catch (err) {
    console.error(err);
  }
};

router.post("/", async (req, res) => {
  const { nombre, apellidop, apellidom, correo, rol, departamento } = req.body;
  const defaultPwd = await bcrypt.hash("123456", 12);
  let transaction;

  try {
    await sql.connect(DBconfig);
    transaction = new sql.Transaction();
    await transaction.begin();

    const request = new sql.Request(transaction);
    const insert = await request
      .input("correo", sql.VarChar(50), correo)
      .input("contraseñaHash", sql.VarChar(255), defaultPwd)
      .input("nombre", sql.VarChar(50), nombre)
      .input("apellidop", sql.VarChar(50), apellidop)
      .input("apellidom", sql.VarChar(50), apellidom)
      .input("departamento", sql.Int, departamento)
      .query(
        `INSERT INTO usuario (correo, contraseñaHash, nombre, apellidop, apellidom, idDepartamento_departamento)
           VALUES (@correo, @contraseñaHash, @nombre, @apellidop, @apellidom, @departamento);
           SELECT SCOPE_IDENTITY() AS nuevoUsuarioId`,
      );
    if (insert && insert.recordset && insert.recordset.length > 0) {
      // si si de dio de alta al usurio, tenemos que darle los permisos q dijo el admin
      console.log(insert.recordset[0].nuevoUsuarioId);

      if (
        !(await usuarioTienePermiso(insert.recordset[0].nuevoUsuarioId, rol))
      ) {
        //aqui agregamos los permisos del usuario si es que los tiene
        const permisos = await request
          .input("idUsuarioNuevo", sql.Int, insert.recordset[0].nuevoUsuarioId)
          .input("usuarioRol", sql.Int, rol)
          .query(
            `INSERT INTO permiso (idUsuario_usuario, idRol_rol) VALUES (@idUsuarioNuevo, @usuarioRol) `,
          );
        console.log("RESULTADO ", permisos);
        if (permisos) {
          console.log("Usuario y permisos dados de alta de manera exitosa");
          res.send("Usuario y permisos dados de alta de manera exitosa");
          await transaction.commit();
        }
      }
    }
  } catch (err) {
    console.error(err);
    if (transaction) {
      try {
        await transaction.rollback();
      } catch (rollbackError) {
        console.error("Error haciendo rollback:", rollbackError);
      }
    }
    res.status(500).send("Error al crear usuario o permisos");
  }
});

// GET /usuario/:id -> obtener datos básicos del usuario
router.get("/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
      return res.status(400).json({ error: "ID de usuario inválido" });
    }

    await sql.connect(DBconfig);
    const request = new sql.Request();
    request.input("idUsuario", sql.Int, id);

    const result = await request.query(`
      SELECT idUsuario, correo, nombre, apellidop, apellidom, idDepartamento_departamento
      FROM usuario
      WHERE idUsuario = @idUsuario;
    `);

    if (result.recordset.length === 0) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }

    const user = result.recordset[0];
    res.json({
      idUsuario: user.idUsuario,
      correo: user.correo,
      nombre: user.nombre,
      apellidop: user.apellidop,
      apellidom: user.apellidom,
      idDepartamento: user.idDepartamento_departamento,
    });
  } catch (err) {
    console.error("Error al obtener usuario:", err);
    res.status(500).json({ error: "Error interno al obtener usuario" });
  }
});

export default router;
