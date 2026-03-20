const express = require('express');
const router = express.Router();
const db = require('../db');

// GET /mesas — lista todas, soporta filtro por query
router.get('/', (req, res) => {
  const token = req.headers['authorization'];
  const { estado, capacidad } = req.query;

  let query = 'SELECT * FROM mesas WHERE 1=1';
  const params = [];

  if (estado) {
    query += ' AND estado LIKE ?';
    params.push(`%${estado}%`);
  }
  if (capacidad) {
    query += ' AND capacidad = ?';
    params.push(capacidad);
  }

  db.all(query, params, (err, rows) => {
    if (err) return res.status(500).json({ success: false, message: err.message });
    res.json({ success: true, total: rows.length, headers: { token }, data: rows });
  });
});

// GET /mesas/:id — obtener por id
router.get('/:id', (req, res) => {
  db.get('SELECT * FROM mesas WHERE id = ?', [req.params.id], (err, row) => {
    if (err) return res.status(500).json({ success: false, message: err.message });
    if (!row) return res.status(404).json({ success: false, message: 'Mesa no encontrada' });
    res.json({ success: true, data: row });
  });
});

// POST /mesas — crear nueva mesa
router.post('/', (req, res) => {
  const { numero, capacidad } = req.body;

  // Validación obligatorios
  if (!numero || !capacidad) {
    return res.status(400).json({ success: false, message: 'numero y capacidad son obligatorios' });
  }
  // Validación tipos
  if (!Number.isInteger(Number(numero)) || numero <= 0) {
    return res.status(400).json({ success: false, message: 'numero debe ser un entero mayor a 0' });
  }
  if (!Number.isInteger(Number(capacidad)) || capacidad <= 0) {
    return res.status(400).json({ success: false, message: 'capacidad debe ser un entero mayor a 0' });
  }

  // Validación unicidad
  db.get('SELECT id FROM mesas WHERE numero = ?', [numero], (err, row) => {
    if (row) return res.status(400).json({ success: false, message: 'Ya existe una mesa con ese número' });

    db.run(
      'INSERT INTO mesas (numero, capacidad) VALUES (?, ?)',
      [numero, capacidad],
      function (err) {
        if (err) return res.status(500).json({ success: false, message: err.message });
        res.status(201).json({ success: true, message: 'Mesa creada correctamente', data: { id: this.lastID, numero, capacidad, estado: 'disponible', activa: 1 } });
      }
    );
  });
});

// PUT /mesas/:id — actualizar mesa
router.put('/:id', (req, res) => {
  const { numero, capacidad, estado, activa } = req.body;

  // Validación tipos
  if (capacidad !== undefined && (!Number.isInteger(Number(capacidad)) || capacidad <= 0)) {
    return res.status(400).json({ success: false, message: 'capacidad debe ser un entero mayor a 0' });
  }

  db.get('SELECT * FROM mesas WHERE id = ?', [req.params.id], (err, row) => {
    if (err) return res.status(500).json({ success: false, message: err.message });
    if (!row) return res.status(404).json({ success: false, message: 'Mesa no encontrada' });

    const actualizado = {
      numero: numero || row.numero,
      capacidad: capacidad || row.capacidad,
      estado: estado || row.estado,
      activa: activa !== undefined ? activa : row.activa,
    };

    db.run(
      'UPDATE mesas SET numero = ?, capacidad = ?, estado = ?, activa = ? WHERE id = ?',
      [actualizado.numero, actualizado.capacidad, actualizado.estado, actualizado.activa, req.params.id],
      function (err) {
        if (err) return res.status(500).json({ success: false, message: err.message });
        res.json({ success: true, message: 'Mesa actualizada correctamente', data: { id: parseInt(req.params.id), ...actualizado } });
      }
    );
  });
});

// DELETE /mesas/:id — eliminar mesa
router.delete('/:id', (req, res) => {
  db.get('SELECT * FROM mesas WHERE id = ?', [req.params.id], (err, row) => {
    if (err) return res.status(500).json({ success: false, message: err.message });
    if (!row) return res.status(404).json({ success: false, message: 'Mesa no encontrada' });

    db.run('DELETE FROM mesas WHERE id = ?', [req.params.id], (err) => {
      if (err) return res.status(500).json({ success: false, message: err.message });
      res.json({ success: true, message: 'Mesa eliminada correctamente', data: row });
    });
  });
});

module.exports = router;