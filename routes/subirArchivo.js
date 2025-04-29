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
          `SELECT idDepartamento FROM departamento WHERE nombreDepartamento = @nombreDpto`
        );
        
        let idDepartamento;
        if (existeDepto.recordset.length > 0) {
          idDepartamento = existeDepto.recordset[0].idDepartamento;
        } else {
          const crearDepto = await reqDepto.query(`
            INSERT INTO departamento (nombreDepartamento)
            OUTPUT INSERTED.idDepartamento
            VALUES (@nombreDpto);
            `);
          console.log(`Depto ${entrada.Departamento} creado de manera exitosa!`)
          idDepartamento = crearDepto.recordset[0].idDepartamento;
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

        // —————— GRUPO ——————
        if (!entrada.Grupo) continue;

        const reqGrupo = new sql.Request();
        reqGrupo
          .input("claveGrupo",       sql.VarChar(5),  entrada.Grupo)
          .input("periodoId",        sql.Int,         1)              // o tu id dinámico de periodo
          .input("matriculaMaestro", sql.VarChar(10), matriculaProf)  // p.ej. "A001"
          .input("claveMateria",     sql.VarChar(15), claveMateria);   // p.ej. "TC2005"

        // 1) Compruebo si el grupo ya existe
        const existeGpo = await reqGrupo.query(`
          SELECT crn
            FROM grupo
          WHERE claveGrupo = @claveGrupo
            AND matriculaMaestro_profesor = @matriculaMaestro
            AND clave_materia = @claveMateria;
        `);

        let nuevoCrn;
        if (existeGpo.recordset.length === 0) {
          // 2a) No existe → lo inserto y obtengo el CRN generado
          const crearGrupo = await reqGrupo.query(`
            INSERT INTO grupo
              (claveGrupo, idPeriodo_periodoEscolar, matriculaMaestro_profesor, clave_materia)
            OUTPUT INSERTED.crn
            VALUES
              (@claveGrupo, @periodoId, @matriculaMaestro, @claveMateria);
          `);
          nuevoCrn = crearGrupo.recordset[0].crn;
          console.log(`Grupo ${entrada.Grupo}.${claveMateria} creado con CRN = ${nuevoCrn}`);
        } else {
          // 2b) Ya existía → tomo el CRN del SELECT
          nuevoCrn = existeGpo.recordset[0].crn;
          console.log(`Grupo ya existe con CRN = ${nuevoCrn}`);
        }

        // —————— PREGUNTAS + RESPUESTAS ——————
        for (const dato of entrada.preguntas) {
          // 3) Aseguro que la pregunta exista (o la creo y obtengo su id)
          const texto = dato.pregunta;
          const reqPregunta = new sql.Request();
          reqPregunta.input("textoPregunta", sql.VarChar(250), texto);

          const existePregunta = await reqPregunta.query(`
            SELECT idPregunta
              FROM pregunta
            WHERE texto = @textoPregunta;
          `);

          let idPregunta;
          if (existePregunta.recordset.length > 0) {
            idPregunta = existePregunta.recordset[0].idPregunta;
          } else {
            const crearPregunta = await reqPregunta.query(`
              INSERT INTO pregunta (texto)
              OUTPUT INSERTED.idPregunta
              VALUES (@textoPregunta);
            `);
            idPregunta = crearPregunta.recordset[0].idPregunta;
            console.log(`Pregunta "${texto}" creada con id = ${idPregunta}`);
          }

          // 4) Inserto la respuesta usando el nuevoCrn y el idPregunta
          const reqResp = new sql.Request();
          reqResp
            .input("matriculaAlumno", sql.VarChar(10), entrada.Matricula)
            .input("idPregunta",      sql.Int,          idPregunta)
            .input("respuesta",       sql.Int,          dato.respuesta)
            .input("crn_grupo",       sql.Int,          nuevoCrn);

          await reqResp.query(`
            INSERT INTO respuesta
              (matriculaAlumno_alumno, idPregunta_pregunta, respuesta, crn_grupo)
            VALUES
              (@matriculaAlumno, @idPregunta, @respuesta, @crn_grupo);
          `);
          console.log(`Respuesta para pregunta ${idPregunta} insertada en grupo ${nuevoCrn}`);
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
