IF DB_ID('Highpoint') IS NOT NULL
    DROP DATABASE Highpoint;
GO

CREATE DATABASE Highpoint;
GO

USE Highpoint;
GO

-- ---
-- Tablas
-- ---

DROP TABLE IF EXISTS [grupo];
CREATE TABLE [grupo] (
  [crn] INT IDENTITY(1,1) NOT NULL,
  [idPeriodo_periodoEscolar] INT NOT NULL, --por mientras todos son 1 (agosto)
  [matriculaMaestro_profesor] VARCHAR(10) NOT NULL,
  [clave_materia] VARCHAR(15) NOT NULL,
  [claveGrupo] VARCHAR(5) NOT NULL,
  PRIMARY KEY ([crn])
);

DROP TABLE IF EXISTS [alumno];
CREATE TABLE [alumno] (
  [matriculaAlumno] VARCHAR(10) NOT NULL,
  PRIMARY KEY ([matriculaAlumno])
);

DROP TABLE IF EXISTS [respuesta];
CREATE TABLE [respuesta] (
  [idRespuesta] INT IDENTITY(1,1) NOT NULL,
  [matriculaAlumno_alumno] VARCHAR(10) NOT NULL,
  [respuesta] INT NULL,
  [idPregunta_pregunta] INT NULL,
  [crn_grupo] INT NOT NULL,
  PRIMARY KEY ([idRespuesta])
);

DROP TABLE IF EXISTS [comentario];
CREATE TABLE [comentario] (
  [idComentario] INT IDENTITY(1,1) NOT NULL,
  [crn] INT NOT NULL,
  [comentario] VARCHAR(250) NOT NULL,
  [matriculaAlumno_alumno] VARCHAR(10) NOT NULL,
  PRIMARY KEY ([idComentario])
);

DROP TABLE IF EXISTS [materia];
CREATE TABLE [materia] (
  [clave] VARCHAR(15) NOT NULL,
  [nombreMateria] VARCHAR(30) NOT NULL,
  [idDepartamento_departamento] INT NOT NULL,
  PRIMARY KEY ([clave])
);

DROP TABLE IF EXISTS [departamento];
CREATE TABLE [departamento] (
  [idDepartamento] INT IDENTITY(1,1) NOT NULL,
  [nombreDepartamento] VARCHAR(30) NOT NULL,
  PRIMARY KEY ([idDepartamento])
);

DROP TABLE IF EXISTS [inscrito];
CREATE TABLE [inscrito] (
  [crn_grupo] INT NOT NULL,
  [matriculaAlumno_alumno] VARCHAR(10) NOT NULL,
  PRIMARY KEY ([crn_grupo], [matriculaAlumno_alumno])
);
--por el momento vale burger
DROP TABLE IF EXISTS [periodoEscolar];
CREATE TABLE [periodoEscolar] (
  [idPeriodo] INT IDENTITY(1,1) NOT NULL,
  [fechaInicio] DATETIME NOT NULL,
  [fechaFin] DATETIME NOT NULL,
  PRIMARY KEY ([idPeriodo])
);

DROP TABLE IF EXISTS [profesor];
CREATE TABLE [profesor] (
  [matriculaMaestro] VARCHAR(10) NOT NULL,
  [nombre] VARCHAR(30) NOT NULL,
  [apellidoPaterno] VARCHAR(30) NOT NULL,
  [apellidoMaterno] VARCHAR(30) NOT NULL,
  [idDepartamento_departamento] INT NOT NULL,
  PRIMARY KEY ([matriculaMaestro])
);

DROP TABLE IF EXISTS [pregunta];
CREATE TABLE [pregunta] (
  [idPregunta] INT IDENTITY(1,1) NOT NULL,
  [texto] VARCHAR(250) NOT NULL,
  PRIMARY KEY ([idPregunta])
);

DROP TABLE IF EXISTS [usuario];
CREATE TABLE [usuario] (
  [idUsuario] INT IDENTITY(1,1) NOT NULL,
  [correo] VARCHAR(50) NOT NULL,
  [contraseñaHash] VARCHAR(255) NOT NULL,
  [nombre] VARCHAR(50) NOT NULL,
  [apellidop] VARCHAR(50) NOT NULL,
  [apellidom] VARCHAR(50) NOT NULL,
  [idDepartamento_departamento] INT NULL, -- aqui puse una relación para q a cada usario le corresponda un departamento
  PRIMARY KEY ([idUsuario])
);

DROP TABLE IF EXISTS [permiso];
CREATE TABLE [permiso] (
  [idUsuario_usuario] INT NOT NULL,
  [idRol_rol] INT NOT NULL,
  PRIMARY KEY ([idUsuario_usuario], [idRol_rol])
);

DROP TABLE IF EXISTS [rol];
CREATE TABLE [rol] (
  [idRol] INT IDENTITY(1,1) NOT NULL,
  [rol] VARCHAR(50) NOT NULL,
  PRIMARY KEY ([idRol])
);

-- ---
-- Llaves foráneas
-- ---

ALTER TABLE [grupo] ADD FOREIGN KEY ([idPeriodo_periodoEscolar]) REFERENCES [periodoEscolar]([idPeriodo]);
ALTER TABLE [grupo] ADD FOREIGN KEY ([matriculaMaestro_profesor]) REFERENCES [profesor]([matriculaMaestro]);
ALTER TABLE [grupo] ADD FOREIGN KEY ([clave_materia]) REFERENCES [materia]([clave]);

ALTER TABLE [respuesta] ADD FOREIGN KEY ([matriculaAlumno_alumno]) REFERENCES [alumno]([matriculaAlumno]);
ALTER TABLE [respuesta] ADD FOREIGN KEY ([idPregunta_pregunta]) REFERENCES [pregunta]([idPregunta]);
ALTER TABLE [respuesta] ADD FOREIGN KEY ([crn_grupo]) REFERENCES [grupo]([crn]);

ALTER TABLE [comentario] ADD FOREIGN KEY ([crn]) REFERENCES [grupo]([crn]);
ALTER TABLE [comentario] ADD FOREIGN KEY ([matriculaAlumno_alumno]) REFERENCES [alumno]([matriculaAlumno]);

ALTER TABLE [materia] ADD FOREIGN KEY ([idDepartamento_departamento]) REFERENCES [departamento]([idDepartamento]);

ALTER TABLE [inscrito] ADD FOREIGN KEY ([crn_grupo]) REFERENCES [grupo]([crn]);
ALTER TABLE [inscrito] ADD FOREIGN KEY ([matriculaAlumno_alumno]) REFERENCES [alumno]([matriculaAlumno]);

ALTER TABLE [profesor] ADD FOREIGN KEY ([idDepartamento_departamento]) REFERENCES [departamento]([idDepartamento]);

ALTER TABLE [permiso] ADD FOREIGN KEY ([idUsuario_usuario]) REFERENCES [usuario]([idUsuario]);
ALTER TABLE [permiso] ADD FOREIGN KEY ([idRol_rol]) REFERENCES [rol]([idRol]);

ALTER TABLE [usuario] ADD FOREIGN KEY ([idDepartamento_departamento]) REFERENCES [departamento]([idDepartamento]);


--  Temporalmente
INSERT INTO periodoEscolar (fechaInicio, fechaFin)
VALUES ('2025-08-01', '2025-12-15');

INSERT INTO departamento (nombreDepartamento) VALUES
('Academico'),
('Deportivo'),
('Cultural'),
('Laboratorista'),
('Tutores');

-- Usuarios
INSERT INTO usuario (correo, contraseñaHash, nombre, apellidop, apellidom, idDepartamento_departamento) VALUES
('alonso@tec.mx', '$2b$12$uY7.0ZJWoUbsdPSiQpAK2e51.WjkfFeqVJ1J/PsD56GfbOtKs1HiC', 'Alonso', 'Alarcon', 'Parra', 5);

-- Roles
INSERT INTO rol (rol) VALUES
('Administrador'),
('Profesor'),
('Alumno');

-- Permisos
INSERT INTO permiso (idUsuario_usuario, idRol_rol) VALUES
(1, 1), -- a alonso darle el permiso 1 y todos ajajja
(1, 2), 
(1, 3); 

