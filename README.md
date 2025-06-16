# MercadoLibre Challenge

A full-stack demo project inspired by MercadoLibre, featuring a Flask backend and a Next.js frontend. The backend serves product, merchant, review, and related product data from normalized JSON files, while the frontend provides a modern, responsive UI for browsing products.

## 🏗️ Project Structure

- `backend/` — Flask API (Python 3.11)
- `frontend/` — Next.js 15 + TypeScript app
- `docker-compose.yml` — Orchestrates both services
- `run.md` — Step-by-step run instructions

## 🚀 Quick Start (Docker Compose)

1. From this directory, build and start both services:
   ```sh
   docker-compose up --build
   ```
   - Backend: [http://localhost:5001](http://localhost:5001)
   - Frontend: [http://localhost:3000](http://localhost:3000)

2. To stop:
   ```sh
   docker-compose down
   ```

## 📝 Features
- Product, merchant, review, and related product APIs
- In-memory caching for fast reads
- Prometheus `/metrics` endpoint
- OpenAPI/Swagger docs for backend
- Modern, responsive frontend UI
- Unit tests and coverage for both backend and frontend
- Fully dockerized for easy deployment

## 📚 Documentation
- Backend: [`backend/README.md`](./backend/README.md)
- Frontend: [`frontend/README.md`](./frontend/README.md)
- Run instructions: [`run.md`](./run.md)

## 🧪 Testing
- Backend: `pytest` (see backend README)
- Frontend: `npm test` (see frontend README)

---

© 2025 MercadoLibre Challenge
