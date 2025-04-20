const API = "http://localhost:3000/departamento/";

async function leerDepartamentos() {
  try {
    const response = await fetch(API);
    const json = await response.json();
    console.log(json);
  } catch (err) {
    console.error(err);
  }
}

async function leerDepartamentosID(ID) {
  try {
    const response = await fetch(API + ID);
    const json = await response.json();
    console.log(json);
  } catch (err) {
    console.error(err);
  }
}

async function crearDepartamento(idDepartamento, nombreDepartamento) {
  try {
    const response = await fetch(API, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        idDepartamento,
        nombreDepartamento,
      }),
    });
    const data = await response.text();
    console.log("Respuesta del servidor:", data);
  } catch (err) {
    console.error("Error al insertar el departamento:", err);
  }
}

async function actualizarDepartamento(idDepartamento, nombreDepartamento) {
  try {
    console.log(`${API}/${idDepartamento}`);
    const response = await fetch(`${API}/${idDepartamento}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        nombreDepartamento,
      }),
    });
    const data = await response.text();
    console.log("Respuesta del servidor:", data);
  } catch (err) {
    console.error("Error al insertar el departamento:", err);
  }
}

async function eliminarDepartamento(idDepartamento) {
  try {
    console.log(`${API}/${idDepartamento}`);
    const response = await fetch(`${API}/${idDepartamento}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    });
    const data = await response.text();
    console.log("Respuesta del servidor:", data);
  } catch (err) {
    console.error("Error al eliminar el departamento:", err);
  }
}

async function testDepartamentos() {
  console.log("Leyendo todos los departamentos:");
  await leerDepartamentos();

  console.log("Creando un nuevo departamento...");
  const nuevoId = 10;
  const nuevoNombre = "Departamento de Innovación";
  await crearDepartamento(nuevoId, nuevoNombre);

  console.log("Leyendo los departamentos después de la creación:");
  await leerDepartamentos();

  console.log("Actualizando el departamento...");
  const nuevoNombreActualizado = "Innovación y Desarrollo";
  await actualizarDepartamento(nuevoId, nuevoNombreActualizado);

  console.log("Leyendo los departamentos después de la actualización:");
  await leerDepartamentos();

  console.log("Eliminando el departamento...");
  await eliminarDepartamento(nuevoId);

  console.log("Leyendo los departamentos después de la eliminación:");
  await leerDepartamentos();
}

//Caso de prueba
testDepartamentos();
