# Store Inventory — Final MERN Factory Store

Production-oriented inventory system for connectors, couplers, terminals and other factory store items.

## Features
- JWT login and first-user admin bootstrap
- Admin / Manager / Employee roles
- Connector SKU master and locations/racks
- Stock IN and Stock OUT with balance history
- Negative-stock protection and concurrency-safe atomic stock updates
- Supplier management
- Low-stock dashboard
- 3D interactive rack visualization
- 14-day stock movement charts
- Transaction audit trail
- Responsive modern UI
- MongoDB Atlas ready

## Requirements
- Node.js 20+ recommended
- MongoDB Atlas account (recommended for transactions/production)

## 1. Configure backend
```bash
cd server
npm install
copy .env.example .env
```
On macOS/Linux use `cp .env.example .env`.
Edit `.env` and set `MONGODB_URI`, `JWT_SECRET`, and `CLIENT_URL`.

## 2. Start backend
```bash
npm run dev
```
API: http://localhost:5000
Health check: http://localhost:5000/api/health

## 3. Start frontend (new terminal)
```bash
cd client
npm install
npm run dev
```
Open the Vite URL shown in the terminal, normally http://localhost:5173.

## First login
Choose “Create first admin account” on the login page. The very first registered account becomes `admin`; later registrations are `employee`.

## Production build
Frontend:
```bash
cd client
npm run build
npm run preview
```
Set `VITE_API_URL` at build time when the API is hosted remotely, for example:
`VITE_API_URL=https://your-api.example.com/api`

Backend deployment: deploy `server` to Render/Railway/Fly.io/etc. and set the environment variables there.
Frontend deployment: deploy `client/dist` to Vercel/Netlify/etc.
Database: MongoDB Atlas.

## Data model
`Connector` stores the current balance and SKU information. `StockTransaction` is the audit trail. Never use direct quantity edits for normal stock movement; use Stock IN/OUT so every change is traceable.

## Backup recommendation
Enable MongoDB Atlas automated backups if your plan supports them. For a free deployment, also export periodic database dumps to an offline/cloud backup. Keep at least one backup outside the production database account.
