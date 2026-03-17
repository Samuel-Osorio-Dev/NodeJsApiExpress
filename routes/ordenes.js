const express = require('express');
const router = express.Router();

let ordenes = [
  { id: 1, mesaId: 1, platos: [1, 2], total: 43000, estado: 'pendiente', fecha: '2026-03-17' },
  { id: 2, mesaId: 2, platos: [3], total: 5000, estado: 'entregada', fecha: '2026-03-17' },
];

// GET /ordenes — lista todas, soporta filtro por query
router.get('/', (req, res) => {
  const token = req.headers['authorization'];
  const filtros = req.query;
  const data = ordenes.filter(o =>
    Object.entries(filtros).every(([k, v]) =>
      o[k]?.toString().toLowerCase().includes(v.toLowerCase())
    )
  );
  res.json({ success: true, total: data.length, headers: { token }, data });
});

// GET /ordenes/:id — obtener por id
router.get('/:id', (req, res) => {
  const orden = ordenes.find(o => o.id === parseInt(req.params.id));
  if (!orden) return res.status(404).json({ success: false, message: 'Orden no encontrada' });
  res.json({ success: true, data: orden });
});

// POST /ordenes — crear nueva orden
router.post('/', (req, res) => {
  const { mesaId, platos, total } = req.body;
  if (!mesaId || !platos || !total) {
    return res.status(400).json({ success: false, message: 'Faltan campos obligatorios: mesaId, platos, total' });
  }
  const nueva = {
    id: ordenes.length + 1,
    mesaId,
    platos,
    total,
    estado: 'pendiente',
    fecha: new Date().toISOString().slice(0, 10),
  };
  ordenes.push(nueva);
  res.status(201).json({ success: true, message: 'Orden creada correctamente', data: nueva });
});

// PUT /ordenes/:id — actualizar estado de orden
router.put('/:id', (req, res) => {
  const index = ordenes.findIndex(o => o.id === parseInt(req.params.id));
  if (index === -1) return res.status(404).json({ success: false, message: 'Orden no encontrada' });
  ordenes[index] = { ...ordenes[index], ...req.body };
  res.json({ success: true, message: 'Orden actualizada correctamente', data: ordenes[index] });
});

// DELETE /ordenes/:id — cancelar/eliminar orden
router.delete('/:id', (req, res) => {
  const index = ordenes.findIndex(o => o.id === parseInt(req.params.id));
  if (index === -1) return res.status(404).json({ success: false, message: 'Orden no encontrada' });
  const eliminada = ordenes.splice(index, 1);
  res.json({ success: true, message: 'Orden eliminada correctamente', data: eliminada[0] });
});

module.exports = router;