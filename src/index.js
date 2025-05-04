import express from "express";
import cors from "cors";
import departamentos from "../routes/departamento.js";
import alumnos from "../routes/alumno.js";
import login from "../routes/login.js";
import usuario from "../routes/usuario.js";
import directorio from "../routes/directorio.js";
import subirArchivoRouter from "../routes/subirArchivo.js";
import infoDestacada from "../routes/materia.js";
import gestionComentarios from "../routes/gestionComentario.js";

const app = express();
const PUERTO = 3000;
// Configuración robusta de CORS
app.use(
  cors({
    origin: "*",
    credentials: true,
  }),
);
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE,OPTIONS");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization",
  );
  next();
});

// Permitir JSON grande
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

app.use("/departamento", departamentos);
app.use("/directorio", directorio);
app.use("/alumno", alumnos);
app.use("/login", login);
app.use("/usuario", usuario);
app.use("/subirArchivo", subirArchivoRouter);
app.use("/info", infoDestacada);
app.use("/comentarios", gestionComentarios);

app.listen(PUERTO, () =>
  console.log(`Servidor activo en http://localhost:${PUERTO}`),
);

const DBconfig = {
  user: "sa",
  password: "YourPassword123!",
  server: "localhost",
  database: "Highpoint",
  trustServerCertificate: true,
};

export default DBconfig;
