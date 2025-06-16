# MercadoLibre Product API Backend

A Flask (Python 3.11) backend for the MercadoLibre-style challenge. Serves product, merchant, review, and related product data from normalized JSON files, with metrics and OpenAPI docs.

## 🚀 Quick Start

### Local Development
1. Install dependencies (recommended: use a virtualenv):
   ```sh
   python3 -m venv venv
   source venv/bin/activate
   pip install -r requirements.txt
   ```
2. Run the server:
   ```sh
   python app.py
   ```
   API runs at [http://localhost:5001](http://localhost:5001)

### API Docs
- Swagger UI: [http://localhost:5001/apidocs](http://localhost:5001/apidocs)
- Prometheus metrics: [http://localhost:5001/metrics](http://localhost:5001/metrics)

### Docker
Build and run with Docker (see project root `docker-compose.yml`):
```sh
docker-compose up --build
```

## 📦 Endpoints
- `GET /api/products/<id>` — Product details (with merchant, reviews, related)
- `GET /api/merchants` — List all merchants
- `GET /api/products/<id>/view` — Register a product view
- `GET /api/products/<id>/related` — Related products
- `GET /metrics` — Prometheus metrics

## ⚙️ Configuration
- Data in `database/` folder: `products.json`, `merchants.json`, `reviews.json`, `related_products.json`
- Caching: In-memory cache for JSON loads
- OpenAPI/Swagger: Config in `swagger_config.yml`

## 🗂️ Structure
- `app.py` — App factory, main entrypoint
- `products.py`, `merchants.py`, `metrics.py` — Blueprints
- `utils.py` — Helpers for data loading, caching, etc.
- `test_app.py` — Unit tests (pytest)
- `database/` — JSON data files

## 🧪 Testing
- Run tests: `pytest test_app.py`
- Coverage: `pytest --cov`

## 📝 Notes
- Exposes port 5001 by default (see `app.py` and Dockerfile)
- Designed to work with the Next.js frontend in this repo
- For Docker, both frontend and backend are orchestrated via `docker-compose.yml`

---

© 2025 MercadoLibre Challenge
