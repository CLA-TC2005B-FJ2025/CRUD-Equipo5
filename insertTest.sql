
USE Highpoint;
GO

-- Departamentos
INSERT INTO departamento (nombreDepartamento) VALUES
('Ingeniería'),
('Ciencias Sociales');

-- Usuarios
INSERT INTO usuario (correo, contraseñaHash) VALUES
('admin@highpoint.edu', 'hash123admin'),
('profe1@highpoint.edu', 'hash123profe1'),
('alumno1@highpoint.edu', 'hash123alumno1');

-- Roles
INSERT INTO rol (rol) VALUES
('Administrador'),
('Profesor'),
('Alumno');

-- Permisos
INSERT INTO permiso (idUsuario_usuario, idRol_rol) VALUES
(1, 1), -- admin
(2, 2), -- profe
(3, 3); -- alumno

-- Profesores
INSERT INTO profesor (matriculaMaestro, nombre, apellidoPaterno, apellidoMaterno, idDepartamento_departamento) VALUES
('P0001', 'Ana', 'López', 'García', 1),
('P0002', 'Carlos', 'Ramírez', 'Díaz', 2);

-- Periodos escolares
INSERT INTO periodoEscolar (fechaInicio, fechaFin) VALUES
('2025-01-15', '2025-06-15'),
('2025-08-01', '2025-12-15');

-- Materias
INSERT INTO materia (clave, nombreMateria, idDepartamento_departamento) VALUES
('MAT101', 'Álgebra', 1),
('SOC201', 'Sociología', 2);

-- Grupos
INSERT INTO grupo (crn, idPeriodo_periodoEscolar, matriculaMaestro_profesor, clave_materia) VALUES
('G1001', 1, 'P0001', 'MAT101'),
('G1002', 2, 'P0002', 'SOC201');

-- Alumnos
INSERT INTO alumno (matriculaAlumno) VALUES
('A0001'),
('A0002');

-- Inscritos
INSERT INTO inscrito (crn_grupo, matriculaAlumno_alumno) VALUES
('G1001', 'A0001'),
('G1001', 'A0002'),
('G1002', 'A0002');

-- Preguntas
INSERT INTO pregunta (texto) VALUES
('¿Te gustó la clase?'),
('¿Recomendarías al profesor?');

-- Respuestas
INSERT INTO respuesta (matriculaAlumno_alumno, respuesta, idPregunta_pregunta, crn_grupo) VALUES
('A0001', 5, 1, 'G1001'),
('A0002', 4, 1, 'G1001'),
('A0002', 3, 2, 'G1002');

-- Comentarios
INSERT INTO comentario (crn, comentario, matriculaAlumno_alumno) VALUES
('G1001', 'Muy buena clase, el profe explica bien.', 'A0001'),
('G1002', 'Faltó profundidad en los temas.', 'A0002');
