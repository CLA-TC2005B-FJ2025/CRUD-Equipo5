USE Highpoint;
GO

-- Insert into 'departamento'
INSERT INTO [departamento] ([idDepartamento], [nombreDepartamento]) VALUES
(1, 'Mathematics'),
(2, 'Computer Science'),
(3, 'Physics');

-- Insert into 'materia'
INSERT INTO [materia] ([clave], [nombreMateria], [idDepartamento_departamento]) VALUES
('MATH101', 'Calculus I', 1),
('CS101', 'Introduction to Programming', 2),
('PHYS101', 'Fundamentals of Physics', 3);

-- Insert into 'profesor'
INSERT INTO [profesor] ([matriculaMaestro], [nombre], [apellidoPaterno], [apellidoMaterno], [idDepartamento_departamento], [mailMaestro], [contraHash]) VALUES
('P001', 'John', 'Doe', 'Smith', 1, "p001@tec.mx", "$2b$12$WyAzQcOixcuh6pd4flWIHOnQ70EgWFMbZt4AWDTACbzYYSROYFoQC"),
('P002', 'Jane', 'Roe', 'Jones', 2, "p002@tec.mx", "$2b$12$8ajmGq5Q4mazGHJqcZBqzenmE2NifEKHkF/HHVYnSh8mlbfqD2yx6"),
('P003', 'Albert', 'Einstein', 'Fermi', 3, "p003@tec.mx", "$2b$12$8ajmGq5Q4mazGHJqcZBqzenmE2NifEKHkF/HHVYnSh8mlbfqD2yx6");

-- Insert into 'periodoEscolar'
INSERT INTO [periodoEscolar] ([idPeriodo], [fechaInicio], [fechaFin]) VALUES
(1, '2023-09-01', '2023-12-15'),
(2, '2024-01-10', '2024-05-20');

-- Insert into 'grupo'
INSERT INTO [grupo] ([crn], [idPeriodo_periodoEscolar], [matriculaMaestro_profesor], [clave_materia]) VALUES
('G001', 1, 'P001', 'MATH101'),
('G002', 1, 'P002', 'CS101'),
('G003', 2, 'P003', 'PHYS101');

-- Insert into 'alumno'
INSERT INTO [alumno] ([matriculaAlumno], [nombre], [apellidoPaterno], [apellidoMaterno]) VALUES
('A001', 'Carlos', 'Perez', 'Gomez'),
('A002', 'Maria', 'Lopez', 'Martinez'),
('A003', 'Luis', 'Garcia', 'Rodriguez');

-- Insert into 'inscrito'
INSERT INTO [inscrito] ([crn_grupo], [matriculaAlumno_alumno]) VALUES
('G001', 'A001'),
('G002', 'A002'),
('G003', 'A003');

-- Insert into 'pregunta'
INSERT INTO [pregunta] ([texto]) VALUES
('What is the integral of x^2?'),
('Explain the concept of Object-Oriented Programming.'),
('What is the speed of light in a vacuum?');

-- Insert into 'respuesta'
INSERT INTO [respuesta] ([matriculaAlumno_alumno], [respuesta], [idPregunta_pregunta], [crn_grupo]) VALUES
('A001', 3, 1, 'G001'),  -- Student A001 answered Question 1 in group G001
('A002', 1, 2, 'G002'),  -- Student A002 answered Question 2 in group G002
('A003', 2, 3, 'G003');  -- Student A003 answered Question 3 in group G003

-- Insert into 'comentario'
INSERT INTO [comentario] ([crn], [comentario], [matriculaAlumno_alumno]) VALUES
('G001', 'Great class! Really enjoyed the lectures.', 'A001'),
('G002', 'The programming assignments are tough, but informative.', 'A002'),
('G003', 'Physics is amazing, but the material is hard to understand.', 'A003');
