const express = require('express');
const router = express.Router();
const db = require('../db');

// GET /ingredientes — lista todos, soporta filtro por query
router.get('/', (req, res) => {
  const token = req.headers['authorization'];
  const { nombre, unidad } = req.query;

  let query = 'SELECT * FROM ingredientes WHERE 1=1';
  const params = [];

  if (nombre) {
    query += ' AND nombre LIKE ?';
    params.push(`%${nombre}%`);
  }
  if (unidad) {
    query += ' AND unidad LIKE ?';
    params.push(`%${unidad}%`);
  }

  db.all(query, params, (err, rows) => {
    if (err) return res.status(500).json({ success: false, message: err.message });
    res.json({ success: true, total: rows.length, headers: { token }, data: rows });
  });
});

// GET /ingredientes/:id — obtener por id
router.get('/:id', (req, res) => {
  db.get('SELECT * FROM ingredientes WHERE id = ?', [req.params.id], (err, row) => {
    if (err) return res.status(500).json({ success: false, message: err.message });
    if (!row) return res.status(404).json({ success: false, message: 'Ingrediente no encontrado' });
    res.json({ success: true, data: row });
  });
});

// POST /ingredientes — crear nuevo ingrediente
router.post('/', (req, res) => {
  const { nombre, unidad, stock } = req.body;

  // Validación obligatorios
  if (!nombre || !unidad) {
    return res.status(400).json({ success: false, message: 'nombre y unidad son obligatorios' });
  }
  // Validación tipos
  if (stock !== undefined && (!Number.isInteger(Number(stock)) || stock < 0)) {
    return res.status(400).json({ success: false, message: 'stock debe ser un entero mayor o igual a 0' });
  }

  // Validación unicidad
  db.get('SELECT id FROM ingredientes WHERE nombre = ?', [nombre], (err, row) => {
    if (row) return res.status(400).json({ success: false, message: 'Ya existe un ingrediente con ese nombre' });

    db.run(
      'INSERT INTO ingredientes (nombre, unidad, stock) VALUES (?, ?, ?)',
      [nombre, unidad, stock || 0],
      function (err) {
        if (err) return res.status(500).json({ success: false, message: err.message });
        res.status(201).json({ success: true, message: 'Ingrediente creado correctamente', data: { id: this.lastID, nombre, unidad, stock: stock || 0 } });
      }
    );
  });
});

// PUT /ingredientes/:id — actualizar ingrediente
router.put('/:id', (req, res) => {
  const { nombre, unidad, stock, activo } = req.body;

  // Validación tipos
  if (stock !== undefined && (!Number.isInteger(Number(stock)) || stock < 0)) {
    return res.status(400).json({ success: false, message: 'stock debe ser un entero mayor o igual a 0' });
  }

  db.get('SELECT * FROM ingredientes WHERE id = ?', [req.params.id], (err, row) => {
    if (err) return res.status(500).json({ success: false, message: err.message });
    if (!row) return res.status(404).json({ success: false, message: 'Ingrediente no encontrado' });

    const actualizado = {
      nombre: nombre || row.nombre,
      unidad: unidad || row.unidad,
      stock: stock !== undefined ? stock : row.stock,
      activo: activo !== undefined ? activo : row.activo,
    };

    db.run(
      'UPDATE ingredientes SET nombre = ?, unidad = ?, stock = ?, activo = ? WHERE id = ?',
      [actualizado.nombre, actualizado.unidad, actualizado.stock, actualizado.activo, req.params.id],
      function (err) {
        if (err) return res.status(500).json({ success: false, message: err.message });
        res.json({ success: true, message: 'Ingrediente actualizado correctamente', data: { id: parseInt(req.params.id), ...actualizado } });
      }
    );
  });
});

// DELETE /ingredientes/:id — eliminar ingrediente
router.delete('/:id', (req, res) => {
  db.get('SELECT * FROM ingredientes WHERE id = ?', [req.params.id], (err, row) => {
    if (err) return res.status(500).json({ success: false, message: err.message });
    if (!row) return res.status(404).json({ success: false, message: 'Ingrediente no encontrado' });

    db.run('DELETE FROM ingredientes WHERE id = ?', [req.params.id], (err) => {
      if (err) return res.status(500).json({ success: false, message: err.message });
      res.json({ success: true, message: 'Ingrediente eliminado correctamente', data: row });
    });
  });
});

module.exports = router;