CREATE DATABASE IF NOT EXISTS ranchodb;

USE ranchodb;

CREATE TABLE IF NOT EXISTS Actividades(
    id INT NOT NULL AUTO_INCREMENT,
    Nombre VARCHAR(50) NOT NULL,
    Descripcion VARCHAR(100) NOT NULL,
    PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS MateriaPrima(
    id INT NOT NULL AUTO_INCREMENT,
    Nombre VARCHAR(50) NOT NULL,
    Descripcion VARCHAR(100) NOT NULL,
    Cantidad int(100) NOT NULL,
    PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS Direcciones(
    id INT NOT NULL AUTO_INCREMENT,
    Calle VARCHAR(50) NOT NULL,
    Numero VARCHAR(10) NOT NULL,
    Colonia VARCHAR(50) NOT NULL,
    CP int(10) NOT NULL,
    Municipio VARCHAR(50) NOT NULL,
    Estado VARCHAR(50) NOT NULL,
    Pais VARCHAR(50) NOT NULL,
    PRIMARY KEY (id)
);

-- Creación de la tabla fragmentada verticalmente
CREATE TABLE IF NOT EXISTS Direcciones_Desc (
  id INT NOT NULL AUTO_INCREMENT,
  Calle VARCHAR(50) NOT NULL,
  Numero VARCHAR(10) NOT NULL,
  PRIMARY KEY (id)
);

-- Transferir las columnas correspondientes a la tabla fragmentada vertical
INSERT INTO Direcciones_Desc (id, Calle, Numero)
SELECT id, Calle, Numero FROM Direcciones;

-- Modificar la estructura de la tabla original para eliminar las columnas transferidas
ALTER TABLE Direcciones
DROP COLUMN Calle,
DROP COLUMN Numero;


CREATE TABLE IF NOT EXISTS Alimento_Animal(
    id INT NOT NULL AUTO_INCREMENT,
    Nombre VARCHAR(50) NOT NULL,
    Descripcion VARCHAR(100) NOT NULL,
    Cantidad FLOAT NOT NULL,
    TipoUnidad VARCHAR(10) NOT NULL,
    PRIMARY KEY (id)
);


CREATE TABLE IF NOT EXISTS Clientes(
    id_Cliente INT NOT NULL AUTO_INCREMENT,
    id_Direccion INT NOT NULL,
    Nombre VARCHAR(50) NOT NULL,
    Correo VARCHAR(100) NOT NULL,
    Estatus CHAR(1) NOT NULL,
    PRIMARY KEY (id_Cliente),
    FOREIGN KEY (id_Direccion) REFERENCES Direcciones (id)
);

CREATE TABLE IF NOT EXISTS Proveedores(
    id_Proveedor INT NOT NULL AUTO_INCREMENT,
    id_Direccion INT NOT NULL,
    RazonSocial VARCHAR(50) NOT NULL,
    Telefono VARCHAR(50) NOT NULL,
    Correo VARCHAR(100) NOT NULL,
    Estatus CHAR(1) NOT NULL,
    PRIMARY KEY (id_Proveedor),
    FOREIGN KEY (id_Direccion) REFERENCES Direcciones (id)
);

CREATE TABLE IF NOT EXISTS Personal(
    id INT NOT NULL AUTO_INCREMENT,
    id_Actividad INT NOT NULL,
    id_Material INT NOT NULL,
    Nombre VARCHAR(50) NOT NULL,
    Puesto VARCHAR(50) NOT NULL,
    Salario float NOT NULL,
    Turno INT NOT NULL,
    Estatus CHAR(1) NOT NULL,
    Cuenta VARCHAR(50) NOT NULL,
    Contra VARCHAR(100) NOT NULL,
    PRIMARY KEY (id),
    FOREIGN KEY (id_Actividad) REFERENCES Actividades (id),
    FOREIGN KEY (id_Material) REFERENCES MateriaPrima (id)
);

CREATE TABLE IF NOT EXISTS Alimento_Venta(
    id INT NOT NULL AUTO_INCREMENT,
    Nombre VARCHAR(50) NOT NULL,
    PrecioUnitario FLOAT NOT NULL,
    Cantidad FLOAT NOT NULL,
    TipoUnidad VARCHAR(10) NOT NULL,
    PRIMARY KEY (id)
);

-- Distribucion vertical
CREATE TABLE IF NOT EXISTS Alimento_Venta_Desc(
    id INT NOT NULL AUTO_INCREMENT,
    Nombre VARCHAR(50) NOT NULL,
    TipoUnidad VARCHAR(10) NOT NULL,
    PRIMARY KEY (id)
);

-- Transferir las columnas correspondientes a la tabla fragmentada vertical
INSERT INTO Alimento_Venta_Desc (id, Nombre, TipoUnidad)
SELECT id, Nombre, TipoUnidad FROM Alimento_Venta;

-- Modificar la estructura de la tabla original para eliminar las columnas transferidas
ALTER TABLE Alimento_Venta
DROP COLUMN Nombre,
DROP COLUMN TipoUnidad;


-- Se quito llave foranea de producto para manejarlo mediante un control interno
CREATE TABLE IF NOT EXISTS Ventas(
    id_Venta INT NOT NULL AUTO_INCREMENT,
    id_Cliente INT NOT NULL,
    id_Producto INT NOT NULL,
    Cantidad INT NOT NULL,
    Precio FLOAT NOT NULL,
    Total FLOAT NOT NULL,
    Fecha DATE NOT NULL,
    PRIMARY KEY (id_Venta),
    FOREIGN KEY (id_Cliente) REFERENCES Clientes (id_Cliente)
);

-- Fragmentacion de forma horizontal
CREATE TABLE IF NOT EXISTS Ventas_Mayores(
    id_Venta INT NOT NULL AUTO_INCREMENT,
    id_Cliente INT NOT NULL,
    id_Producto INT NOT NULL,
    Cantidad INT NOT NULL,
    Precio FLOAT NOT NULL,
    Total FLOAT NOT NULL,
    Fecha DATE NOT NULL,
    PRIMARY KEY (id_Venta),
    FOREIGN KEY (id_Cliente) REFERENCES Clientes (id_Cliente)
);

-- De igual forma que la tabla anterior (Despues menciono la idea para manejar esto)
CREATE TABLE IF NOT EXISTS Compras(
    id_Compra INT NOT NULL AUTO_INCREMENT,
    id_Proveedor INT NOT NULL,
    id_Producto INT NOT NULL,
    id_Personal INT NOT NULL,
    Cantidad INT NOT NULL,
    Precio_Unitario FLOAT NOT NULL,
    Fecha DATE NOT NULL,
    PRIMARY KEY (id_Compra),
    FOREIGN KEY (id_Proveedor) REFERENCES Proveedores (id_Proveedor),
    FOREIGN KEY (id_Personal) REFERENCES Personal (id)
);

-- Fragmentacion de forma horizontal
CREATE TABLE IF NOT EXISTS Compras_Mayores(
    id_Compra INT NOT NULL AUTO_INCREMENT,
    id_Proveedor INT NOT NULL,
    id_Producto INT NOT NULL,
    id_Personal INT NOT NULL,
    Cantidad INT NOT NULL,
    Precio_Unitario FLOAT NOT NULL,
    Fecha DATE NOT NULL,
    PRIMARY KEY (id_Compra),
    FOREIGN KEY (id_Proveedor) REFERENCES Proveedores (id_Proveedor),
    FOREIGN KEY (id_Personal) REFERENCES Personal (id)
);

CREATE TABLE IF NOT EXISTS Tipo_Animales(
    id INT NOT NULL AUTO_INCREMENT,
    id_Alimento INT NOT NULL,
    id_Alimento_Venta INT NOT NULL,
    id_Personal INT NOT NULL,
    Nombre VARCHAR(50) NOT NULL,
    Cantidad INT(100) NOT NULL,
    Precio FLOAT NOT NULL,
    Comida CHAR(1) NOT NULL,
    PRIMARY KEY(id),
    FOREIGN KEY (id_Alimento) REFERENCES Alimento_Animal (id),
    FOREIGN KEY (id_Alimento_Venta) REFERENCES Alimento_Venta (id),
    FOREIGN KEY (id_Personal) REFERENCES Personal (id)
);

--Checar NOT NULL
CREATE TABLE IF NOT EXISTS Animales(
    id_Animal INT NOT NULL AUTO_INCREMENT,
    id_Tipo_Animal INT NOT NULL,
    Peso FLOAT NOT NULL,
    Litros_Dia FLOAT NOT NULL,
    Litros_Total FLOAT NOT NULL,
    Huevos_Dia INT NOT NULL,
    Huevos_Total INT NOT NULL,
    PRIMARY KEY (id_Animal),
    FOREIGN KEY (id_Tipo_Animal) REFERENCES Tipo_Animales (id)
);