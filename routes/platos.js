const express = require('express');
const router = express.Router();
const db = require('../db');

// GET /platos — lista todos, soporta filtro por query
router.get('/', (req, res) => {
  const token = req.headers['authorization'];
  const { nombre, categoria } = req.query;

  let query = 'SELECT * FROM platos WHERE 1=1';
  const params = [];

  if (nombre) {
    query += ' AND nombre LIKE ?';
    params.push(`%${nombre}%`);
  }
  if (categoria) {
    query += ' AND categoria LIKE ?';
    params.push(`%${categoria}%`);
  }

  db.all(query, params, (err, rows) => {
    if (err) return res.status(500).json({ success: false, message: err.message });
    res.json({ success: true, total: rows.length, headers: { token }, data: rows });
  });
});

// GET /platos/:id — obtener por id
router.get('/:id', (req, res) => {
  db.get('SELECT * FROM platos WHERE id = ?', [req.params.id], (err, row) => {
    if (err) return res.status(500).json({ success: false, message: err.message });
    if (!row) return res.status(404).json({ success: false, message: 'Plato no encontrado' });
    res.json({ success: true, data: row });
  });
});

// POST /platos — crear nuevo plato
router.post('/', (req, res) => {
  const { nombre, precio, categoria, stock } = req.body;

  // Validación obligatorios
  if (!nombre || !precio || !categoria) {
    return res.status(400).json({ success: false, message: 'nombre, precio y categoria son obligatorios' });
  }
  // Validación tipos
  if (isNaN(precio) || precio <= 0) {
    return res.status(400).json({ success: false, message: 'precio debe ser un número mayor a 0' });
  }
  if (stock !== undefined && (!Number.isInteger(Number(stock)) || stock < 0)) {
    return res.status(400).json({ success: false, message: 'stock debe ser un entero mayor o igual a 0' });
  }

  // Validación unicidad
  db.get('SELECT id FROM platos WHERE nombre = ?', [nombre], (err, row) => {
    if (row) return res.status(400).json({ success: false, message: 'Ya existe un plato con ese nombre' });

    db.run(
      'INSERT INTO platos (nombre, precio, categoria, stock) VALUES (?, ?, ?, ?)',
      [nombre, precio, categoria, stock || 0],
      function (err) {
        if (err) return res.status(500).json({ success: false, message: err.message });
        res.status(201).json({ success: true, message: 'Plato creado correctamente', data: { id: this.lastID, nombre, precio, categoria, stock: stock || 0 } });
      }
    );
  });
});

// PUT /platos/:id — actualizar plato
router.put('/:id', (req, res) => {
  const { nombre, precio, categoria, stock, activo } = req.body;

  // Validación tipos
  if (precio !== undefined && (isNaN(precio) || precio <= 0)) {
    return res.status(400).json({ success: false, message: 'precio debe ser un número mayor a 0' });
  }
  if (stock !== undefined && (!Number.isInteger(Number(stock)) || stock < 0)) {
    return res.status(400).json({ success: false, message: 'stock debe ser un entero mayor o igual a 0' });
  }

  db.get('SELECT * FROM platos WHERE id = ?', [req.params.id], (err, row) => {
    if (err) return res.status(500).json({ success: false, message: err.message });
    if (!row) return res.status(404).json({ success: false, message: 'Plato no encontrado' });

    const actualizado = {
      nombre: nombre || row.nombre,
      precio: precio || row.precio,
      categoria: categoria || row.categoria,
      stock: stock !== undefined ? stock : row.stock,
      activo: activo !== undefined ? activo : row.activo,
    };

    db.run(
      'UPDATE platos SET nombre = ?, precio = ?, categoria = ?, stock = ?, activo = ? WHERE id = ?',
      [actualizado.nombre, actualizado.precio, actualizado.categoria, actualizado.stock, actualizado.activo, req.params.id],
      function (err) {
        if (err) return res.status(500).json({ success: false, message: err.message });
        res.json({ success: true, message: 'Plato actualizado correctamente', data: { id: parseInt(req.params.id), ...actualizado } });
      }
    );
  });
});

// DELETE /platos/:id — eliminar plato
router.delete('/:id', (req, res) => {
  db.get('SELECT * FROM platos WHERE id = ?', [req.params.id], (err, row) => {
    if (err) return res.status(500).json({ success: false, message: err.message });
    if (!row) return res.status(404).json({ success: false, message: 'Plato no encontrado' });

    db.run('DELETE FROM platos WHERE id = ?', [req.params.id], (err) => {
      if (err) return res.status(500).json({ success: false, message: err.message });
      res.json({ success: true, message: 'Plato eliminado correctamente', data: row });
    });
  });
});

module.exports = router;