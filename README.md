# WalletGo 💰

Aplicación de control financiero personal para estudiantes universitarios. Registra ingresos y gastos, visualiza tu situación financiera con gráficas, define un presupuesto mensual y gestiona tus transacciones con autenticación por usuario.

---

## Stack

| Capa | Tecnología |
|------|-----------|
| Frontend | React 18 + TypeScript + Vite |
| Backend | Node.js + Express + TypeScript |
| Base de datos | MongoDB + Mongoose |
| Autenticación | JWT + bcryptjs |
| HTTP client | Axios |
| Gráficas | Recharts |

---

## Funcionalidades

- **Autenticación** — registro e inicio de sesión con email y contraseña. Cada usuario solo ve sus propios datos.
- **Dashboard** — balance total, ingresos y gastos del mes actual, barra de progreso del presupuesto y gráfica de dona por categoría.
- **Transacciones** — crear, editar y eliminar ingresos y gastos con categoría, descripción y fecha.
- **Historial** — lista de todas las transacciones con filtros por tipo (todas / ingresos / gastos).
- **Presupuesto mensual** — definir un límite de gasto con alerta visual si se excede.
- **Gráfica por categoría** — visualización de gastos distribuidos por categoría en gráfica de dona.
- **Diseño responsive** — funciona en móvil y escritorio.

---

## Estructura de carpetas

```
walletgo/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   └── database.ts
│   │   ├── controllers/
│   │   │   ├── authController.ts
│   │   │   ├── transactionController.ts
│   │   │   └── budgetController.ts
│   │   ├── middleware/
│   │   │   ├── auth.ts
│   │   │   └── errorHandler.ts
│   │   ├── models/
│   │   │   ├── User.ts
│   │   │   ├── Transaction.ts
│   │   │   └── Budget.ts
│   │   ├── routes/
│   │   │   ├── authRoutes.ts
│   │   │   ├── transactionRoutes.ts
│   │   │   └── budgetRoutes.ts
│   │   └── index.ts
│   ├── .env
│   ├── package.json
│   └── tsconfig.json
│
└── frontend/
    ├── public/
    │   └── logo.png
    ├── src/
    │   ├── components/
    │   │   ├── AuthScreen.tsx
    │   │   ├── Header.tsx
    │   │   ├── Dashboard.tsx
    │   │   ├── CategoryChart.tsx
    │   │   ├── TransactionForm.tsx
    │   │   ├── TransactionList.tsx
    │   │   ├── EditModal.tsx
    │   │   └── BudgetPanel.tsx
    │   ├── context/
    │   │   ├── AuthContext.tsx
    │   │   └── WalletContext.tsx
    │   ├── styles/
    │   │   └── global.css
    │   ├── types/
    │   │   └── index.ts
    │   ├── utils/
    │   │   ├── api.ts
    │   │   └── format.ts
    │   ├── App.tsx
    │   └── index.tsx
    ├── index.html
    ├── vite.config.ts
    ├── .env
    ├── package.json
    └── tsconfig.json
```

---

## Requisitos previos

- **Node.js** v18 o superior → https://nodejs.org
- **MongoDB Community** corriendo en `localhost:27017` → https://www.mongodb.com/try/download/community
  - Instalar con opciones por defecto (MongoDB corre como servicio de Windows automáticamente)

---

## Instalación y ejecución

### 1. Backend

```bash
cd walletgo/backend
npm install
npm run dev
```

Debes ver:
```
MongoDB connected successfully
Server running on http://localhost:5000
```

### 2. Frontend

Abre otra terminal:

```bash
cd walletgo/frontend
npm install
npm run dev
```

La app abre en `http://localhost:3000`

---

## Variables de entorno

### backend/.env
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/walletgo
NODE_ENV=development
JWT_SECRET=walletgo_super_secret_key_cambiar_en_produccion
JWT_EXPIRES_IN=7d
```

### frontend/.env
```
VITE_API_URL=http://localhost:5000/api
```

---

## Endpoints de la API

### Autenticación
| Método | Ruta | Descripción | Auth |
|--------|------|-------------|------|
| POST | /api/auth/register | Crear cuenta | No |
| POST | /api/auth/login | Iniciar sesión | No |
| GET | /api/auth/me | Obtener usuario actual | Sí |

### Transacciones
| Método | Ruta | Descripción | Auth |
|--------|------|-------------|------|
| GET | /api/transactions | Listar transacciones del usuario | Sí |
| POST | /api/transactions | Crear transacción | Sí |
| PUT | /api/transactions/:id | Editar transacción | Sí |
| DELETE | /api/transactions/:id | Eliminar transacción | Sí |
| GET | /api/transactions/summary | Resumen financiero del mes | Sí |

### Presupuesto
| Método | Ruta | Descripción | Auth |
|--------|------|-------------|------|
| GET | /api/budget | Obtener presupuesto del usuario | Sí |
| POST | /api/budget | Crear o actualizar presupuesto | Sí |

Todas las rutas protegidas requieren header:
```
Authorization: Bearer <token>
```

---

## Modelos de base de datos

### User
| Campo | Tipo | Descripción |
|-------|------|-------------|
| name | String | Nombre del usuario |
| email | String | Email único |
| password | String | Contraseña encriptada con bcrypt |

### Transaction
| Campo | Tipo | Descripción |
|-------|------|-------------|
| amount | Number | Monto de la transacción |
| type | String | `income` o `expense` |
| category | String | Categoría seleccionada |
| description | String | Descripción del movimiento |
| date | Date | Fecha de la transacción |
| user | ObjectId | Referencia al usuario dueño |

### Budget
| Campo | Tipo | Descripción |
|-------|------|-------------|
| monthlyLimit | Number | Límite de gasto mensual |
| user | ObjectId | Referencia al usuario dueño |

---

## Categorías disponibles

**Ingresos:** Salario, Beca, Freelance, Regalo, Inversión, Otro ingreso

**Gastos:** Alimentación, Transporte, Educación, Entretenimiento, Salud, Ropa, Tecnología, Servicios, Otro gasto

---

## Scripts

### Backend
| Comando | Acción |
|---------|--------|
| `npm run dev` | Servidor con hot-reload |
| `npm run build` | Compila TypeScript |
| `npm start` | Inicia versión compilada |

### Frontend
| Comando | Acción |
|---------|--------|
| `npm run dev` | Inicia en modo desarrollo |
| `npm run build` | Build de producción |
| `npm run preview` | Preview del build |

---

## MongoDB Atlas (alternativa a instalación local)

1. Crea cuenta gratuita en https://cloud.mongodb.com
2. Crea un cluster **M0 (Free)**
3. En "Database Access" crea un usuario con contraseña
4. En "Network Access" agrega `0.0.0.0/0`
5. Copia el connection string y reemplaza en `backend/.env`:

```
MONGODB_URI=mongodb+srv://<usuario>:<password>@cluster0.xxxxx.mongodb.net/walletgo
```

---

## Notas de seguridad

- Las contraseñas se encriptan con bcrypt (12 rounds) antes de guardarse
- El JWT expira en 7 días
- Cada usuario solo puede ver, editar y eliminar sus propios datos
- Cambiar `JWT_SECRET` por una cadena segura antes de desplegar a producción
