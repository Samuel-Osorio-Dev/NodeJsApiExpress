# API REST Restaurante – SENA

## Descripción
API REST desarrollada con Node.js y Express.js para un sistema de restaurante. Implementa CRUD completo para 4 recursos: Platos, Ingredientes, Mesas y Órdenes.

## Tecnologías
- Node.js v22
- Express.js
- Thunder Client / Postman

## Instalación
```bash
npm install
node index.js
```

## Endpoints

### Platos
| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | /platos | Lista todos los platos (soporta filtro por query) |
| GET | /platos/:id | Obtiene un plato por ID |
| POST | /platos | Crea un nuevo plato |
| PUT | /platos/:id | Actualiza un plato existente |
| DELETE | /platos/:id | Elimina un plato |

### Ingredientes
| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | /ingredientes | Lista todos los ingredientes (soporta filtro por query) |
| GET | /ingredientes/:id | Obtiene un ingrediente por ID |
| POST | /ingredientes | Crea un nuevo ingrediente |
| PUT | /ingredientes/:id | Actualiza un ingrediente existente |
| DELETE | /ingredientes/:id | Elimina un ingrediente |

### Mesas
| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | /mesas | Lista todas las mesas (soporta filtro por query) |
| GET | /mesas/:id | Obtiene una mesa por ID |
| POST | /mesas | Crea una nueva mesa |
| PUT | /mesas/:id | Actualiza una mesa existente |
| DELETE | /mesas/:id | Elimina una mesa |

### Órdenes
| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | /ordenes | Lista todas las órdenes (soporta filtro por query) |
| GET | /ordenes/:id | Obtiene una orden por ID |
| POST | /ordenes | Crea una nueva orden |
| PUT | /ordenes/:id | Actualiza el estado de una orden |
| DELETE | /ordenes/:id | Cancela/elimina una orden |

## Ejemplos de uso

### Filtro por query params
```
GET /platos?categoria=sopa
GET /mesas?estado=disponible
```

### Header requerido
```
Authorization: Bearer mi-token-123
```

### Ejemplo POST /platos
```json
{
  "nombre": "Cazuela de Mariscos",
  "precio": 32000,
  "categoria": "plato fuerte",
  "stock": 5
}
```

### Ejemplo POST /ordenes
```json
{
  "mesaId": 1,
  "platos": [1, 2],
  "total": 43000
}
```

## Estructura del proyecto
```
restaurante/
├── index.js
├── package.json
└── routes/
    ├── platos.js
    ├── ingredientes.js
    ├── mesas.js
    └── ordenes.js
```

## Integrantes
| Nombre | Rol |
|--------|-----|
| Samuel Osorio | Tech Lead / Backend Developer |

## Programa
SENA – Tecnología en Análisis y Desarrollo de Software  
Instructor: Mateo