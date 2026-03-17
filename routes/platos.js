const express = require('express');
const router = express.Router();

let platos = [
  { id: 1, nombre: 'Bandeja Paisa', precio: 25000, categoria: 'plato fuerte', stock: 10, activo: true },
  { id: 2, nombre: 'Ajiaco', precio: 18000, categoria: 'sopa', stock: 8, activo: true },
  { id: 3, nombre: 'Empanadas', precio: 5000, categoria: 'entrada', stock: 20, activo: true },
];

// GET /platos — lista todos, soporta filtro por query
router.get('/', (req, res) => {
  const token = req.headers['authorization'];
  const filtros = req.query;
  const data = platos.filter(p =>
    Object.entries(filtros).every(([k, v]) =>
      p[k]?.toString().toLowerCase().includes(v.toLowerCase())
    )
  );
  res.json({ success: true, total: data.length, headers: { token }, data });
});

// GET /platos/:id — obtener por id
router.get('/:id', (req, res) => {
  const plato = platos.find(p => p.id === parseInt(req.params.id));
  if (!plato) return res.status(404).json({ success: false, message: 'Plato no encontrado' });
  res.json({ success: true, data: plato });
});

// POST /platos — crear nuevo plato
router.post('/', (req, res) => {
  const { nombre, precio, categoria, stock } = req.body;
  if (!nombre || !precio || !categoria) {
    return res.status(400).json({ success: false, message: 'Faltan campos obligatorios: nombre, precio, categoria' });
  }
  const nuevo = {
    id: platos.length + 1,
    nombre,
    precio,
    categoria,
    stock: stock || 0,
    activo: true,
  };
  platos.push(nuevo);
  res.status(201).json({ success: true, message: 'Plato creado correctamente', data: nuevo });
});

// PUT /platos/:id — actualizar plato
router.put('/:id', (req, res) => {
  const index = platos.findIndex(p => p.id === parseInt(req.params.id));
  if (index === -1) return res.status(404).json({ success: false, message: 'Plato no encontrado' });
  platos[index] = { ...platos[index], ...req.body };
  res.json({ success: true, message: 'Plato actualizado correctamente', data: platos[index] });
});

// DELETE /platos/:id — eliminar plato
router.delete('/:id', (req, res) => {
  const index = platos.findIndex(p => p.id === parseInt(req.params.id));
  if (index === -1) return res.status(404).json({ success: false, message: 'Plato no encontrado' });
  const eliminado = platos.splice(index, 1);
  res.json({ success: true, message: 'Plato eliminado correctamente', data: eliminado[0] });
});

module.exports = router;