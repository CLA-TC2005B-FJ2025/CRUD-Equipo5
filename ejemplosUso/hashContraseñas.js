import bcrypt from "bcrypt";

/* 
    Este script es nomas para crear el hash de las contraseñas que vamos a guardar dentro
    de la BDD de datos dummy, ya que por obvias razones no debemos de guardar la contraseña en texto plano.
    Lo que vamos a hacer es guardar un hash del plain text, y cuando el usuario haga login, 
    vamos a hashear ese valor y compararlo con el de la base de datos!
*/
const ejemploContras = ["hola1234", "contraSegura", "tec2025!"];

ejemploContras.forEach(async (contra) => {
  const hash = await bcrypt.hash(contra, 12);
  // console.log(hash)
});

const hashString = async (string) => {
  return await bcrypt.hash(string, 12);
};
// console.log(await hashString("contra"));

const compararContra = async (p, h) => {
  const match = bcrypt.compare(p, h);
  console.log(await match);
};
compararContra(
  "hola1234",
  "$2b$12$uY7.0ZJWoUbsdPSiQpAK2e51.WjkfFeqVJ1J/PsD56GfbOtKs1HiC",
);
