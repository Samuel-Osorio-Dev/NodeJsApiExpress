const express = require('express');
const router = express.Router();
const db = require('../db');

// GET /ordenes — lista todas, soporta filtro por query
router.get('/', (req, res) => {
  const token = req.headers['authorization'];
  const { estado, mesaId } = req.query;

  let query = 'SELECT * FROM ordenes WHERE 1=1';
  const params = [];

  if (estado) {
    query += ' AND estado LIKE ?';
    params.push(`%${estado}%`);
  }
  if (mesaId) {
    query += ' AND mesaId = ?';
    params.push(mesaId);
  }

  db.all(query, params, (err, rows) => {
    if (err) return res.status(500).json({ success: false, message: err.message });
    res.json({ success: true, total: rows.length, headers: { token }, data: rows });
  });
});

// GET /ordenes/:id — obtener por id
router.get('/:id', (req, res) => {
  db.get('SELECT * FROM ordenes WHERE id = ?', [req.params.id], (err, row) => {
    if (err) return res.status(500).json({ success: false, message: err.message });
    if (!row) return res.status(404).json({ success: false, message: 'Orden no encontrada' });
    res.json({ success: true, data: row });
  });
});

// POST /ordenes — crear nueva orden
router.post('/', (req, res) => {
  const { mesaId, total } = req.body;

  // Validación obligatorios
  if (!mesaId || !total) {
    return res.status(400).json({ success: false, message: 'mesaId y total son obligatorios' });
  }
  // Validación tipos
  if (!Number.isInteger(Number(mesaId)) || mesaId <= 0) {
    return res.status(400).json({ success: false, message: 'mesaId debe ser un entero mayor a 0' });
  }
  if (isNaN(total) || total <= 0) {
    return res.status(400).json({ success: false, message: 'total debe ser un número mayor a 0' });
  }

  // Verificar que la mesa exista
  db.get('SELECT id FROM mesas WHERE id = ?', [mesaId], (err, row) => {
    if (!row) return res.status(404).json({ success: false, message: 'La mesa indicada no existe' });

    const fecha = new Date().toISOString().slice(0, 10);

    db.run(
      'INSERT INTO ordenes (mesaId, total, estado, fecha) VALUES (?, ?, ?, ?)',
      [mesaId, total, 'pendiente', fecha],
      function (err) {
        if (err) return res.status(500).json({ success: false, message: err.message });
        res.status(201).json({ success: true, message: 'Orden creada correctamente', data: { id: this.lastID, mesaId, total, estado: 'pendiente', fecha } });
      }
    );
  });
});

// PUT /ordenes/:id — actualizar orden
router.put('/:id', (req, res) => {
  const { mesaId, total, estado } = req.body;

  // Validación tipos
  if (total !== undefined && (isNaN(total) || total <= 0)) {
    return res.status(400).json({ success: false, message: 'total debe ser un número mayor a 0' });
  }

  db.get('SELECT * FROM ordenes WHERE id = ?', [req.params.id], (err, row) => {
    if (err) return res.status(500).json({ success: false, message: err.message });
    if (!row) return res.status(404).json({ success: false, message: 'Orden no encontrada' });

    const actualizado = {
      mesaId: mesaId || row.mesaId,
      total: total || row.total,
      estado: estado || row.estado,
      fecha: row.fecha,
    };

    db.run(
      'UPDATE ordenes SET mesaId = ?, total = ?, estado = ?, fecha = ? WHERE id = ?',
      [actualizado.mesaId, actualizado.total, actualizado.estado, actualizado.fecha, req.params.id],
      function (err) {
        if (err) return res.status(500).json({ success: false, message: err.message });
        res.json({ success: true, message: 'Orden actualizada correctamente', data: { id: parseInt(req.params.id), ...actualizado } });
      }
    );
  });
});

// DELETE /ordenes/:id — eliminar orden
router.delete('/:id', (req, res) => {
  db.get('SELECT * FROM ordenes WHERE id = ?', [req.params.id], (err, row) => {
    if (err) return res.status(500).json({ success: false, message: err.message });
    if (!row) return res.status(404).json({ success: false, message: 'Orden no encontrada' });

    db.run('DELETE FROM ordenes WHERE id = ?', [req.params.id], (err) => {
      if (err) return res.status(500).json({ success: false, message: err.message });
      res.json({ success: true, message: 'Orden eliminada correctamente', data: row });
    });
  });
});

module.exports = router;