# WalletGo 💰

Control financiero personal para estudiantes. Registra ingresos y gastos, define un presupuesto mensual y visualiza tu situación financiera en tiempo real.

---

## Stack

| Capa | Tecnología |
|------|-----------|
| Frontend | React 18 + TypeScript + Vite |
| Backend | Node.js + Express + TypeScript |
| Base de datos | MongoDB + Mongoose |
| HTTP client | Axios |

---

## Estructura de carpetas

```
walletgo/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   └── database.ts
│   │   ├── controllers/
│   │   │   ├── transactionController.ts
│   │   │   └── budgetController.ts
│   │   ├── middleware/
│   │   │   └── errorHandler.ts
│   │   ├── models/
│   │   │   ├── Transaction.ts
│   │   │   └── Budget.ts
│   │   ├── routes/
│   │   │   ├── transactionRoutes.ts
│   │   │   └── budgetRoutes.ts
│   │   └── index.ts
│   ├── .env
│   ├── package.json
│   └── tsconfig.json
│
└── frontend/
    ├── public/
    ├── src/
    │   ├── components/
    │   │   ├── Header.tsx
    │   │   ├── Dashboard.tsx
    │   │   ├── TransactionForm.tsx
    │   │   ├── TransactionList.tsx
    │   │   └── BudgetPanel.tsx
    │   ├── context/
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
- **MongoDB Community** corriendo localmente en el puerto `27017` → https://www.mongodb.com/try/download/community
  - Instala con las opciones por defecto (instala MongoDB como servicio de Windows, arranca automáticamente)

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
```

### frontend/.env
```
VITE_API_URL=http://localhost:5000/api
```

---

## MongoDB Atlas (alternativa a instalación local)

1. Crea cuenta gratuita en https://cloud.mongodb.com
2. Crea un cluster **M0 (Free)**
3. En "Database Access" crea un usuario con contraseña
4. En "Network Access" agrega `0.0.0.0/0`
5. En "Connect" copia el connection string y reemplaza en `backend/.env`:

```
MONGODB_URI=mongodb+srv://<usuario>:<password>@cluster0.xxxxx.mongodb.net/walletgo
```

---

## Endpoints de la API

| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | /api/transactions | Listar todas las transacciones |
| POST | /api/transactions | Crear transacción |
| PUT | /api/transactions/:id | Actualizar transacción |
| DELETE | /api/transactions/:id | Eliminar transacción |
| GET | /api/transactions/summary | Resumen financiero del mes actual |
| GET | /api/budget | Obtener presupuesto mensual |
| POST | /api/budget | Crear o actualizar presupuesto mensual |

### Ejemplos

**Crear transacción:**
```bash
curl -X POST http://localhost:5000/api/transactions \
  -H "Content-Type: application/json" \
  -d '{
    "amount": 250,
    "type": "expense",
    "category": "Alimentación",
    "description": "Tacos en el campus"
  }'
```

**Crear presupuesto:**
```bash
curl -X POST http://localhost:5000/api/budget \
  -H "Content-Type: application/json" \
  -d '{ "monthlyLimit": 5000 }'
```

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

## Funcionalidades

- Registrar ingresos y gastos con categoría, descripción y fecha
- Filtrar transacciones por tipo (todas / ingresos / gastos)
- Eliminar transacciones
- Resumen mensual: balance, total ingresos, total gastos
- Presupuesto mensual con barra de progreso y alerta si se excede
- Diseño responsive (móvil y escritorio)
- Validación de formularios en frontend y backend