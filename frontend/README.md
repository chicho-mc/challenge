# MercadoLibre Product Page Frontend

A Next.js 15 + TypeScript frontend for the MercadoLibre-style challenge. This app displays product details, merchant info, reviews, and related products, consuming a Flask backend API.

## 🚀 Quick Start

### Local Development
1. Install dependencies:
   ```sh
   npm install
   ```
2. Copy and edit environment variables if needed:
   ```sh
   cp .env.local.example .env.local
   # Edit .env.local to set NEXT_PUBLIC_API_URL (default: http://localhost:5001)
   ```
3. Start the dev server:
   ```sh
   npm run dev
   ```
   App runs at [http://localhost:3000](http://localhost:3000)

### Production Build
```sh
npm run build
npm start
```

### Docker
Build and run with Docker (see project root `docker-compose.yml`):
```sh
docker-compose up --build
```

## 📦 Scripts
- `npm run dev` — Start dev server
- `npm run build` — Build for production
- `npm start` — Start production server
- `npm run lint` — Lint code
- `npm test` — Run tests
- `npm run test:coverage` — Test coverage

## ⚙️ Environment Variables
- `NEXT_PUBLIC_API_URL` — Backend API base URL (default: `http://localhost:5001`)

## 🗂️ Structure
- `app/` — Next.js app directory (routing, pages)
- `components/` — UI and shared components
- `hooks/` — Custom React hooks (e.g., `useProduct`)
- `services/` — API client logic
- `types/` — TypeScript types
- `public/` — Static assets
- `__tests__/` — Unit and integration tests

## 🧪 Testing
- Uses Jest and React Testing Library
- Run tests: `npm test`
- Coverage: `npm run test:coverage`

## 📝 Notes
- Expects backend API at `/api/products/:id`, `/api/merchants`, etc.
- For local dev, ensure backend is running on the correct port (default: 5001).
- For Docker, both frontend and backend are orchestrated via `docker-compose.yml`.

---

© 2025 MercadoLibre Challenge
