const express = require('express');
const router = express.Router();

let ingredientes = [
  { id: 1, nombre: 'Tomate', unidad: 'kg', stock: 50, activo: true },
  { id: 2, nombre: 'Cebolla', unidad: 'kg', stock: 30, activo: true },
  { id: 3, nombre: 'Pollo', unidad: 'kg', stock: 20, activo: true },
];

// GET /ingredientes — lista todos, soporta filtro por query
router.get('/', (req, res) => {
  const token = req.headers['authorization'];
  const filtros = req.query;
  const data = ingredientes.filter(i =>
    Object.entries(filtros).every(([k, v]) =>
      i[k]?.toString().toLowerCase().includes(v.toLowerCase())
    )
  );
  res.json({ success: true, total: data.length, headers: { token }, data });
});

// GET /ingredientes/:id — obtener por id
router.get('/:id', (req, res) => {
  const ingrediente = ingredientes.find(i => i.id === parseInt(req.params.id));
  if (!ingrediente) return res.status(404).json({ success: false, message: 'Ingrediente no encontrado' });
  res.json({ success: true, data: ingrediente });
});

// POST /ingredientes — crear nuevo ingrediente
router.post('/', (req, res) => {
  const { nombre, unidad, stock } = req.body;
  if (!nombre || !unidad) {
    return res.status(400).json({ success: false, message: 'Faltan campos obligatorios: nombre, unidad' });
  }
  const nuevo = {
    id: ingredientes.length + 1,
    nombre,
    unidad,
    stock: stock || 0,
    activo: true,
  };
  ingredientes.push(nuevo);
  res.status(201).json({ success: true, message: 'Ingrediente creado correctamente', data: nuevo });
});

// PUT /ingredientes/:id — actualizar ingrediente
router.put('/:id', (req, res) => {
  const index = ingredientes.findIndex(i => i.id === parseInt(req.params.id));
  if (index === -1) return res.status(404).json({ success: false, message: 'Ingrediente no encontrado' });
  ingredientes[index] = { ...ingredientes[index], ...req.body };
  res.json({ success: true, message: 'Ingrediente actualizado correctamente', data: ingredientes[index] });
});

// DELETE /ingredientes/:id — eliminar ingrediente
router.delete('/:id', (req, res) => {
  const index = ingredientes.findIndex(i => i.id === parseInt(req.params.id));
  if (index === -1) return res.status(404).json({ success: false, message: 'Ingrediente no encontrado' });
  const eliminado = ingredientes.splice(index, 1);
  res.json({ success: true, message: 'Ingrediente eliminado correctamente', data: eliminado[0] });
});

module.exports = router;