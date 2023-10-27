-- Crea la base de datos 'CafeteriaCieloNegro'
CREATE DATABASE CafeteriaCieloNegro;
GO

-- Usar la base de datos
USE CafeteriaCieloNegro;
GO

-- Crea la tabla 'Ordenes'
CREATE TABLE Ordenes (
    OrdenID INT PRIMARY KEY IDENTITY(1,1), 
    Nombre NVARCHAR(150),                   
    Email NVARCHAR(150) NULL,                
    Telefono NVARCHAR(20) NULL,             
    TipoDeCafe NVARCHAR(150),                
    Precio INT,                             
    GalletasExtras NVARCHAR(150) NULL,       
    FechaOrden DATETIME DEFAULT GETDATE()   
);
