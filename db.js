const sqlite3 = require('sqlite3').verbose();

const db = new sqlite3.Database('./database.db', (err) => {
  if (err) console.error('Error conectando:', err.message);
  else console.log('Base de datos conectada');
});

db.serialize(() => {

  // Tabla mesas
  db.run(`CREATE TABLE IF NOT EXISTS mesas (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    numero INTEGER NOT NULL UNIQUE,
    capacidad INTEGER NOT NULL CHECK(capacidad > 0),
    estado TEXT NOT NULL DEFAULT 'disponible',
    activa INTEGER NOT NULL DEFAULT 1
  )`);

  // Tabla platos
  db.run(`CREATE TABLE IF NOT EXISTS platos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nombre TEXT NOT NULL UNIQUE,
    precio REAL NOT NULL CHECK(precio > 0),
    categoria TEXT NOT NULL,
    stock INTEGER NOT NULL DEFAULT 0 CHECK(stock >= 0),
    activo INTEGER NOT NULL DEFAULT 1
  )`);

  // Tabla ingredientes
  db.run(`CREATE TABLE IF NOT EXISTS ingredientes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nombre TEXT NOT NULL UNIQUE,
    unidad TEXT NOT NULL,
    stock INTEGER NOT NULL DEFAULT 0 CHECK(stock >= 0),
    activo INTEGER NOT NULL DEFAULT 1
  )`);

  // Tabla ordenes
  db.run(`CREATE TABLE IF NOT EXISTS ordenes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    mesaId INTEGER NOT NULL,
    total REAL NOT NULL CHECK(total > 0),
    estado TEXT NOT NULL DEFAULT 'pendiente',
    fecha TEXT NOT NULL,
    FOREIGN KEY (mesaId) REFERENCES mesas(id)
  )`);

  // Tabla intermedia orden_platos (N:M)
  db.run(`CREATE TABLE IF NOT EXISTS orden_platos (
    ordenId INTEGER NOT NULL,
    platoId INTEGER NOT NULL,
    PRIMARY KEY (ordenId, platoId),
    FOREIGN KEY (ordenId) REFERENCES ordenes(id),
    FOREIGN KEY (platoId) REFERENCES platos(id)
  )`);

  // Tabla intermedia plato_ingredientes (N:M)
  db.run(`CREATE TABLE IF NOT EXISTS plato_ingredientes (
    platoId INTEGER NOT NULL,
    ingredienteId INTEGER NOT NULL,
    PRIMARY KEY (platoId, ingredienteId),
    FOREIGN KEY (platoId) REFERENCES platos(id),
    FOREIGN KEY (ingredienteId) REFERENCES ingredientes(id)
  )`);

});

module.exports = db;