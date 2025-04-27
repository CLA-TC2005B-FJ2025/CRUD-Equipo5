import express from "express";
import bodyParser from "body-parser";
import departamentos from "../routes/departamento.js";
import alumnos from "../routes/alumno.js";
import login from "../routes/login.js";
import usuario from "../routes/usuario.js";
import cors from "cors";

const app = express();
const PUERTO = 3000;

app.use(bodyParser.json());
app.use(
  cors({
    origin: "*",
    credentials: true, //pa las cookies
  }),
);

app.use("/departamento", departamentos);
app.use("/alumno", alumnos);
app.use("/login", login);
app.use("/usuario", usuario);

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
