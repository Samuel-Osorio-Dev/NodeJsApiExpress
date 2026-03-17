const express = require('express');
const router = express.Router();

let mesas = [
  { id: 1, numero: 1, capacidad: 4, estado: 'disponible', activa: true },
  { id: 2, numero: 2, capacidad: 6, estado: 'ocupada', activa: true },
  { id: 3, numero: 3, capacidad: 2, estado: 'disponible', activa: true },
];

// GET /mesas — lista todas, soporta filtro por query
router.get('/', (req, res) => {
  const token = req.headers['authorization'];
  const filtros = req.query;
  const data = mesas.filter(m =>
    Object.entries(filtros).every(([k, v]) =>
      m[k]?.toString().toLowerCase().includes(v.toLowerCase())
    )
  );
  res.json({ success: true, total: data.length, headers: { token }, data });
});

// GET /mesas/:id — obtener por id
router.get('/:id', (req, res) => {
  const mesa = mesas.find(m => m.id === parseInt(req.params.id));
  if (!mesa) return res.status(404).json({ success: false, message: 'Mesa no encontrada' });
  res.json({ success: true, data: mesa });
});

// POST /mesas — crear nueva mesa
router.post('/', (req, res) => {
  const { numero, capacidad } = req.body;
  if (!numero || !capacidad) {
    return res.status(400).json({ success: false, message: 'Faltan campos obligatorios: numero, capacidad' });
  }
  const nueva = {
    id: mesas.length + 1,
    numero,
    capacidad,
    estado: 'disponible',
    activa: true,
  };
  mesas.push(nueva);
  res.status(201).json({ success: true, message: 'Mesa creada correctamente', data: nueva });
});

// PUT /mesas/:id — actualizar mesa
router.put('/:id', (req, res) => {
  const index = mesas.findIndex(m => m.id === parseInt(req.params.id));
  if (index === -1) return res.status(404).json({ success: false, message: 'Mesa no encontrada' });
  mesas[index] = { ...mesas[index], ...req.body };
  res.json({ success: true, message: 'Mesa actualizada correctamente', data: mesas[index] });
});

// DELETE /mesas/:id — eliminar mesa
router.delete('/:id', (req, res) => {
  const index = mesas.findIndex(m => m.id === parseInt(req.params.id));
  if (index === -1) return res.status(404).json({ success: false, message: 'Mesa no encontrada' });
  const eliminada = mesas.splice(index, 1);
  res.json({ success: true, message: 'Mesa eliminada correctamente', data: eliminada[0] });
});

module.exports = router;