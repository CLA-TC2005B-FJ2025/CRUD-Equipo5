# REST API para operaciones CRUD para plataforma de ECOA's
Esta es la implementación de nuestro API para todas las operaciones CRUD realizadas por nuestra
[plataforma de ECOA's de Highpoint International!](https://github.com/CLA-TC2005B-FJ2025/equipo5-prototipo).

## Método de utilización 

### 1) Inicializar un nuevo codespace (tambien se puede realizar de manera local luego de clonar el repositorio)
### 2) Inicializar las dependencias de npm a travez de la terminal

```sh
npm install
```

### 3) Crear una instancia de SQL Server con Docker

```sh
docker run -e 'ACCEPT_EULA=Y' -e 'SA_PASSWORD=YourPassword123!' \
    -p 1433:1433 --name sqlserver -d mcr.microsoft.com/mssql/server:2022-latest
```

### 4) Instalar sqlcmd

```sh
sudo apt update
sudo apt install mssql-tools unixodbc-dev
echo 'export PATH="$PATH:/opt/mssql-tools/bin"' >> ~/.bashrc
source ~/.bashrc
```

### 5) Inicializar la base de datos utilizando sqlcmd y initDB.sql

```sh
sqlcmd -S localhost -U sa -P YourPassword123! -i initDB.sql
```

Si todo sale bien, deberiamos de ver un mensaje como el siguiente

```sh
Changed database context to 'Highpoint'.

(1 rows affected)
(5 rows affected)
(1 rows affected)
(3 rows affected)
(3 rows affected)
```

Esto significa que la base de datos fue creada de manera exitosa!, asi mismo 
se creo un usuario por default, donde las credenciales son:
```sh
alonso@tec.mx
hola1234
```

Asi mismo, podemos utilizar sqlcmd para verificar que nuestra base de
datos se haya creado de manera exitosa dentro de nuestra instancia de docker

```sh
sqlcmd -S localhost -U sa -P YourPassword123!
> SELECT name FROM sys.databases;
> GO
```

Deberiamos de obtener un resultado similar a lo siguiente

```sh
master
tempdb
model
msdb
Highpoint

(5 rows affected)
```

En este punto, podemos revisar que todo funcione de manera correcta utilizando sqlcmd, asi mismo
nuestra base de datos deberia de estar funcionando dentro del puerto 1433

```sh
sqlcmd -S localhost -U sa -P YourPassword123!
> USE Highpoint
> SELECT nombre FROM usuario
> GO
```

Deberiamos de poder ver el nombre del unico usuario dentro de la base de datos
```sh
nombre                                            
--------------------------------------------------
Alonso                                            
(1 rows affected)
```

### 7) Iniciar el servidor

Una vez nuestra base de datos esta corriendo, lanzaremos nuestro servidor de express con:
```sh
npm run start
```

Esperando el mensaje en terminal

```sh
Servidor activo en http://localhost:3000
```
Aqui debemos de escoger como consumiremos nuestros servicios web desde el front-end, pero, si corremos nuestro CRUD 
desde un codespaces de github, debemos de asegurarnos de tener nuestro puerto de express público, para poder utizar
el link del API desde nuestro front-end

### Operaciones CRUD
Todas las operaciones son realizadas a travéz de nuestra plataforma, cual repositorio es el [siguiente](https://github.com/CLA-TC2005B-FJ2025/equipo5-prototipo).


