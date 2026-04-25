# WalletGo 💰

Control financiero personal para estudiantes. Stack: React + TypeScript (frontend) · Node.js + Express + MongoDB (backend).

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
    │   └── index.html
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
    ├── .env
    ├── package.json
    └── tsconfig.json
```

---

## Requisitos previos

- **Node.js** v18 o superior → https://nodejs.org
- **MongoDB** corriendo localmente en el puerto `27017`
  - Instalación: https://www.mongodb.com/try/download/community
  - O usar MongoDB Atlas (ver sección abajo)

---

## Instalación y ejecución

### 1. Backend

```bash
cd walletgo/backend
npm install
npm run dev
```

El servidor corre en `http://localhost:5000`

### 2. Frontend

Abre otra terminal:

```bash
cd walletgo/frontend
npm install
npm start
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
REACT_APP_API_URL=http://localhost:5000/api
```

---

## MongoDB Atlas (alternativa a instalación local)

1. Crea cuenta en https://cloud.mongodb.com
2. Crea un cluster gratuito
3. Obtén el connection string y reemplaza `MONGODB_URI` en `backend/.env`:

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
| GET | /api/transactions/summary | Resumen del mes actual |
| GET | /api/budget | Obtener presupuesto |
| POST | /api/budget | Crear o actualizar presupuesto |

### Ejemplo: crear transacción

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

### Ejemplo: crear presupuesto

```bash
curl -X POST http://localhost:5000/api/budget \
  -H "Content-Type: application/json" \
  -d '{ "monthlyLimit": 5000 }'
```

---

## Scripts disponibles

### Backend
| Comando | Acción |
|---------|--------|
| `npm run dev` | Inicia servidor con hot-reload |
| `npm run build` | Compila TypeScript a JavaScript |
| `npm start` | Inicia versión compilada |

### Frontend
| Comando | Acción |
|---------|--------|
| `npm start` | Inicia en modo desarrollo |
| `npm run build` | Build de producción |
