DROP DATABASE IF EXISTS Highpoint;
CREATE DATABASE Highpoint;
GO

USE Highpoint;
GO

-- Drop tables if they exist
DROP TABLE IF EXISTS [grupo];
DROP TABLE IF EXISTS [alumno];
DROP TABLE IF EXISTS [respuesta];
DROP TABLE IF EXISTS [comentario];
DROP TABLE IF EXISTS [materia];
DROP TABLE IF EXISTS [departamento];
DROP TABLE IF EXISTS [inscrito];
DROP TABLE IF EXISTS [periodoEscolar];
DROP TABLE IF EXISTS [profesor];
DROP TABLE IF EXISTS [pregunta];

-- Create tables
CREATE TABLE [grupo] (
  [crn] VARCHAR(15) NOT NULL,
  [idPeriodo_periodoEscolar] INT NOT NULL,
  [matriculaMaestro_profesor] VARCHAR(10) NOT NULL,
  [clave_materia] VARCHAR(15) NOT NULL,
  PRIMARY KEY ([crn])
);

CREATE TABLE [alumno] (
  [matriculaAlumno] VARCHAR(10) NOT NULL,
  [nombre] VARCHAR(30) NOT NULL,
  [apellidoPaterno] VARCHAR(30) NOT NULL,
  [apellidoMaterno] VARCHAR(30) NOT NULL,
  PRIMARY KEY ([matriculaAlumno])
);

CREATE TABLE [respuesta] (
  [idRespuesta] INT IDENTITY(1,1) NOT NULL,
  [matriculaAlumno_alumno] VARCHAR(10) NOT NULL,
  [respuesta] INT NULL DEFAULT NULL,
  [idPregunta_pregunta] INT NULL DEFAULT NULL,
  [crn_grupo] VARCHAR(15) NOT NULL,
  PRIMARY KEY ([idRespuesta])
);

CREATE TABLE [comentario] (
  [idComentario] INT IDENTITY(1,1) NOT NULL,
  [crn] VARCHAR(15) NOT NULL,
  [comentario] VARCHAR(250) NOT NULL,
  [matriculaAlumno_alumno] VARCHAR(10) NOT NULL,
  PRIMARY KEY ([idComentario])
);

CREATE TABLE [materia] (
  [clave] VARCHAR(15) NOT NULL,
  [nombreMateria] VARCHAR(30) NOT NULL,
  [idDepartamento_departamento] INT NOT NULL,
  PRIMARY KEY ([clave])
);

CREATE TABLE [departamento] (
  [idDepartamento] INT NOT NULL,
  [nombreDepartamento] VARCHAR(30) NOT NULL,
  PRIMARY KEY ([idDepartamento])
);

CREATE TABLE [inscrito] (
  [crn_grupo] VARCHAR(15) NOT NULL,
  [matriculaAlumno_alumno] VARCHAR(10) NOT NULL,
  PRIMARY KEY ([crn_grupo], [matriculaAlumno_alumno])
);

CREATE TABLE [periodoEscolar] (
  [idPeriodo] INT NOT NULL,
  [fechaInicio] DATETIME NOT NULL,
  [fechaFin] DATETIME NOT NULL,
  PRIMARY KEY ([idPeriodo])
);

CREATE TABLE [profesor] (
  [matriculaMaestro] VARCHAR(10) NOT NULL,
  [nombre] VARCHAR(30) NOT NULL,
  [apellidoPaterno] VARCHAR(30) NOT NULL,
  [apellidoMaterno] VARCHAR(30) NOT NULL,
  [idDepartamento_departamento] INT NOT NULL,
  [mailMaestro] VARCHAR(40) NOT NULL,
  PRIMARY KEY ([matriculaMaestro])
);

CREATE TABLE [pregunta] (
  [idPregunta] INT IDENTITY(1,1) NOT NULL,
  [texto] VARCHAR(250) NOT NULL,
  PRIMARY KEY ([idPregunta])
);

-- Add foreign keys
ALTER TABLE [grupo] ADD FOREIGN KEY ([idPeriodo_periodoEscolar]) REFERENCES [periodoEscolar] ([idPeriodo]);
ALTER TABLE [grupo] ADD FOREIGN KEY ([matriculaMaestro_profesor]) REFERENCES [profesor] ([matriculaMaestro]);
ALTER TABLE [grupo] ADD FOREIGN KEY ([clave_materia]) REFERENCES [materia] ([clave]);
ALTER TABLE [respuesta] ADD FOREIGN KEY ([matriculaAlumno_alumno]) REFERENCES [alumno] ([matriculaAlumno]);
ALTER TABLE [respuesta] ADD FOREIGN KEY ([idPregunta_pregunta]) REFERENCES [pregunta] ([idPregunta]);
ALTER TABLE [respuesta] ADD FOREIGN KEY ([crn_grupo]) REFERENCES [grupo] ([crn]);
ALTER TABLE [comentario] ADD FOREIGN KEY ([crn]) REFERENCES [grupo] ([crn]);
ALTER TABLE [comentario] ADD FOREIGN KEY ([matriculaAlumno_alumno]) REFERENCES [alumno] ([matriculaAlumno]);
ALTER TABLE [materia] ADD FOREIGN KEY ([idDepartamento_departamento]) REFERENCES [departamento] ([idDepartamento]);
ALTER TABLE [inscrito] ADD FOREIGN KEY ([crn_grupo]) REFERENCES [grupo] ([crn]);
ALTER TABLE [inscrito] ADD FOREIGN KEY ([matriculaAlumno_alumno]) REFERENCES [alumno] ([matriculaAlumno]);
ALTER TABLE [profesor] ADD FOREIGN KEY ([idDepartamento_departamento]) REFERENCES [departamento] ([idDepartamento]);
