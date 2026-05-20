# Portfolio Management System

A full-stack portfolio management application built with:

- React (Vite) ⚛️
- Node.js + Express 🚀
- PostgreSQL 🐘
- Prisma ORM 🔥
- Docker 🐳

---

## 🚀 Features

- Create and manage portfolios
- Buy/sell assets
- Transaction tracking
- Real-time portfolio value
- Bulk asset seeding
- Authentication (JWT)

---

## 🐳 Run with Docker

```bash
docker compose up -d --build

docker compose exec server npx prisma migrate deploy

```

---

## ⚙️ Feed data to the assets

```bash

./server/scripts/seed.sh

cp server/.env.example server/.env

```

---



