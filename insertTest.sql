USE Highpoint;
GO

-- ---
-- Insertar datos
-- ---

-- Departamentos
INSERT INTO departamento (nombreDepartamento) VALUES
('Academico'),
('Deportivo'),
('Cultural'),
('Laboratorista'),
('Tutores');

-- Usuarios
INSERT INTO usuario (correo, contraseñaHash, nombre, apellidop, apellidom, idDepartamento_departamento) VALUES
('admin@highpoint.edu', '$2b$12$uY7.0ZJWoUbsdPSiQpAK2e51.WjkfFeqVJ1J/PsD56GfbOtKs1HiC', 'Admin', 'Principal', 'Highpoint', 1),
('profe1@highpoint.edu', '$2b$12$1UeqcTeAK376Xk37KZlhSOoNyXD7NcdETnTbmtMdwCa3TDVz101rW', 'Profe', 'Uno', 'Apellido', 2),
('alumno1@highpoint.edu', '$2b$12$PivYQl8qsJKmCaMjMGW6uOwYMNzyMeqDLJ1Y4BhQSmCzOdtft8.ia', 'Alumno', 'Uno', 'Apellido', 3),
('alonso@tec.mx', '$2b$12$uY7.0ZJWoUbsdPSiQpAK2e51.WjkfFeqVJ1J/PsD56GfbOtKs1HiC', 'Alonso', 'Alarcon', 'Parra', 5);

-- Roles
INSERT INTO rol (rol) VALUES
('Administrador'),
('Profesor'),
('Alumno');

-- Permisos
INSERT INTO permiso (idUsuario_usuario, idRol_rol) VALUES
(1, 1), -- admin
(2, 2), -- profe
(3, 3), -- alumno
(4, 1), -- a alonso darle el permiso 1 y todos ajajja
(4, 2), 
(4, 3); 

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
('SOC201', 'Sociología', 3);

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
