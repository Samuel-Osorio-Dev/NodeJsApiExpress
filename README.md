# API REST Restaurante – SENA

## Equipo
| Nombre | Rol |
|--------|-----|
| Samuel Osorio | Tech Lead / Backend Developer |

## URL de la API en producción
https://api-restaurante-sena.onrender.com

## Autenticación
Todos los endpoints requieren el siguiente header:
```
password: MiPasswordSegura2026
```

## Diagrama ER
![Diagrama ER](assets/diagrama-er.png)

## Diccionario de Datos

### Tabla: mesas
| Campo | Tipo | PK | FK | Restricción | Descripción |
|-------|------|----|----|-------------|-------------|
| id | INTEGER | SI | NO | AUTOINCREMENT | Identificador único |
| numero | INTEGER | NO | NO | NOT NULL, UNIQUE | Número de la mesa |
| capacidad | INTEGER | NO | NO | NOT NULL, > 0 | Cantidad de personas |
| estado | TEXT | NO | NO | NOT NULL, DEFAULT 'disponible' | disponible / ocupada |
| activa | INTEGER | NO | NO | DEFAULT 1 | 1 = activa, 0 = inactiva |

### Tabla: ordenes
| Campo | Tipo | PK | FK | Restricción | Descripción |
|-------|------|----|----|-------------|-------------|
| id | INTEGER | SI | NO | AUTOINCREMENT | Identificador único |
| mesaId | INTEGER | NO | SI | NOT NULL, FK -> mesas.id | Mesa que hizo la orden |
| total | REAL | NO | NO | NOT NULL, > 0 | Total de la orden |
| estado | TEXT | NO | NO | NOT NULL, DEFAULT 'pendiente' | pendiente / entregada / cancelada |
| fecha | TEXT | NO | NO | NOT NULL | Fecha de la orden |

### Tabla: platos
| Campo | Tipo | PK | FK | Restricción | Descripción |
|-------|------|----|----|-------------|-------------|
| id | INTEGER | SI | NO | AUTOINCREMENT | Identificador único |
| nombre | TEXT | NO | NO | NOT NULL, UNIQUE | Nombre del plato |
| precio | REAL | NO | NO | NOT NULL, > 0 | Precio de venta |
| categoria | TEXT | NO | NO | NOT NULL | Tipo de plato |
| stock | INTEGER | NO | NO | NOT NULL, >= 0 | Unidades disponibles |
| activo | INTEGER | NO | NO | DEFAULT 1 | 1 = activo, 0 = inactivo |

### Tabla: ingredientes
| Campo | Tipo | PK | FK | Restricción | Descripción |
|-------|------|----|----|-------------|-------------|
| id | INTEGER | SI | NO | AUTOINCREMENT | Identificador único |
| nombre | TEXT | NO | NO | NOT NULL, UNIQUE | Nombre del ingrediente |
| unidad | TEXT | NO | NO | NOT NULL | kg, litros, unidades, etc. |
| stock | INTEGER | NO | NO | NOT NULL, >= 0 | Cantidad disponible |
| activo | INTEGER | NO | NO | DEFAULT 1 | 1 = activo, 0 = inactivo |

## Tecnologías
- Node.js v22
- Express.js
- SQLite3
- dotenv
- Thunder Client / Postman

## Instalación
```bash
npm install
node index.js
```

## Estructura del proyecto
```
restaurante/
├── index.js
├── db.js
├── database.db
├── .env
├── package.json
├── assets/
│   └── diagrama-er.png
└── routes/
    ├── platos.js
    ├── ingredientes.js
    ├── mesas.js
    └── ordenes.js
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

### Con curl
```bash
curl https://api-restaurante-sena.onrender.com/platos \
     -H "password: MiPasswordSegura2026"
```

### Filtro por query params
```
GET /platos?categoria=sopa
GET /mesas?estado=disponible
```

## Casos de error
| Caso | Código |
|------|--------|
| Sin header password | 401 Unauthorized |
| Password incorrecta | 403 Forbidden |
| ID no existe | 404 Not Found |
| Campos obligatorios vacíos | 400 Bad Request |

## Programa
SENA – Tecnología en Análisis y Desarrollo de Software  
Instructor: Mateo