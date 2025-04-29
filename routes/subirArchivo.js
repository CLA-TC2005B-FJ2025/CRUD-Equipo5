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
      "Matricula",
      "Materia",
      "Grupo",
      "Comentarios",
      "Profesor",
      "MatriculaProfesor",
      "Clase",
      "Departamento",
    ];

    const procesadas = encuestas.map((encuesta) => {
      // valores base
      const base = {};
      camposSistema.forEach((campo) => {
        base[campo] = (encuesta[campo] || "").toString().trim();
      });

      // preguntas dinámicas
      const preguntas = Object.entries(encuesta)
        .filter(
          ([clave, valor]) =>
            !camposSistema.includes(clave) &&
            valor != null &&
            valor.toString().trim() !== "",
        )
        .map(([clave, valor]) => ({
          pregunta: clave.trim(),
          respuesta: valor.toString().trim(),
        }));

      return { ...base, preguntas };
    });

    //si llego a esta parte, todo salio bien con lo de las encuestas, ent hay q comenzar
    //a insetar los datos !
    await sql.connect(DBconfig);
    const transaction = new sql.Transaction();
    await transaction.begin();

    try {
      for (const entrada of procesadas) {
        // Aqui vamos a hacer todas las inserciones a la BDD, el flujo es el siguiente
        // nos vamos recorriendo todas las entidades necesarias, checamos si ya existe
        // con los valores dados por el usuario, sisi, solamente la guardamos, sino tambien
        // tenemos que crearlo(a)

        // —————— DEPARTAMENTO ——————
        if (!entrada.Departamento) continue;
        const reqDepto = new sql.Request();
        reqDepto.input("nombreDpto", sql.VarChar(50), entrada.Departamento);

        const existeDepto = await reqDepto.query(
          `SELECT * FROM departamento WHERE nombreDepartamento = @nombreDpto`,
        );
        let idDepartamento;

        if (existeDepto.rowsAffected[0] == 0) {
          console.log("Creando dtop: ", entrada.Departamento);
          const crearDpto = await reqDepto.query(`
            INSERT INTO departamento (nombreDepartamento) VALUES (@nombreDpto) `);
          idDepartamento = crearDpto.recordset[0].idDepartamento;
        } else {
          idDepartamento = existeDepto.recordset[0].idDepartamento;
        }

        // —————— PROFESOR ——————
        if (!entrada.Profesor) continue;
        const reqProf = new sql.Request();
        const [nombreProf, apellidoPprof, apellidoMprof] =
          entrada.Profesor.split(" ");
        reqProf.input("nombreProf", sql.VarChar(10), nombreProf);
        reqProf.input("apellidoPatProf", sql.VarChar(30), apellidoPprof);
        reqProf.input("apellidoMatProf", sql.VarChar(30), apellidoMprof);
        reqProf.input(
          "matriculaProf",
          sql.VarChar(30),
          entrada.MatriculaProfesor,
        );
        reqProf.input("idDep", sql.Int, parseInt(idDepartamento));

        const existeProf = await reqProf.query(
          `SELECT * FROM profesor WHERE nombre = @nombreProf AND apellidoPaterno = @apellidoPatProf AND apellidoMaterno = @apellidoMatProf AND matriculaMaestro = @matriculaProf`,
        );
        let matriculaProf = entrada.MatriculaProfesor;
        if (existeProf.rowsAffected[0] == 0) {
          console.log("Creando profesor: ", entrada.Profesor);
          const crearProf = await reqProf.query(`
            INSERT INTO profesor
              (matriculaMaestro, nombre, apellidoPaterno, apellidoMaterno, idDepartamento_departamento)
            VALUES
              (@matriculaProf, @nombreProf, @apellidoPatProf, @apellidoMatProf, @idDep);
          `);
          console.log(
            `Profesor con matricula ${matriculaProf} creado de manera exitosa!`,
          );
        }

        // —————— MATERIA ——————
        if (!entrada.Materia) continue;
        const reqMateria = new sql.Request();
        reqMateria.input("claveMateria", sql.VarChar(15), entrada.Materia);
        reqMateria.input("nombreMateria", sql.VarChar(30), entrada.Clase);
        reqMateria.input("idDepto", sql.Int, idDepartamento);

        const existeMateria = await reqMateria.query(
          `SELECT * FROM materia WHERE 
          clave = @claveMateria AND nombreMateria = @nombreMateria AND idDepartamento_departamento = @idDepto`,
        );
        let claveMateria = entrada.Materia;
        if (existeMateria.rowsAffected[0] == 0) {
          console.log("Creando la materia: ", claveMateria);
          const crearMateria = await reqMateria.query(`
            INSERT INTO materia
              (clave, nombreMateria, idDepartamento_departamento)
            VALUES
              (@claveMateria, @nombreMateria, @idDepto);
          `);
          console.log(`Materia ${claveMateria} creada de manera exitosa`);
        }


        // —————— ALUMNO ——————
        if (!entrada.Matricula) continue; 
        const reqAlumno = new sql.Request();
        reqAlumno.input("matriculaAlumno", sql.VarChar(10), entrada.Matricula);

        const existeAlumno = await reqAlumno.query(`
          SELECT * from alumno WHERE matriculaAlumno = @matriculaAlumno  
        `)
        let matriculaAlumno = entrada.Matricula;

        if(existeAlumno.rowsAffected[0] == 0){
          console.log(`Creando al alumno con matricula ${matriculaAlumno}`);
          const crearAlumno = await reqAlumno.query(`
            INSERT INTO alumno VALUES (@matriculaAlumno)
          `)
          console.log(`Alumno con matricula ${matriculaAlumno} creado de manera exitosa!`);
        }

      }

      await transaction.commit();
      console.log("Transacción finalizada con éxito");
    } catch (err) {
      try {
        await transaction.rollback();
        console.log("Rollback ejecutado con éxito");
      } catch (rollErr) {
        console.error("Error al hacer rollback:", rollErr);
      }
      console.error("Error interno:", err);
      res.status(500).json({ error: "Error interno del servidor" });
    }

    res.status(201).send("Encuestas recibidas exitosamente");
  } catch (error) {
    console.error("Error interno:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

export default router;
