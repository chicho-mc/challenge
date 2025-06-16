# How to Run the Application

## Backend (Flask API)

1. Open a terminal and navigate to the backend directory:
   ```sh
   cd challenge/backend
   ```

2. (Recommended) Create and activate a virtual environment:
   ```sh
   python3 -m venv venv
   source venv/bin/activate
   ```

3. Install dependencies:
   ```sh
   pip install -r requirements.txt
   ```

4. Run the Flask server:
   ```sh
   python app.py
   ```
   The backend will start on http://localhost:5001

---

## Frontend (Next.js)

1. Open a new terminal and navigate to the frontend directory:
   ```sh
   cd challenge/frontend
   ```

2. Install dependencies:
   ```sh
   npm install
   ```

3. Start the development server:
   ```sh
   npm run dev
   ```
   The frontend will start on http://localhost:3000

---

## Docker Compose (Recommended: Run Both Services Together)

1. From the root of the `challenge` directory, build and start both backend and frontend:
   ```sh
   docker-compose up --build
   ```
   This will start:
   - Backend (Flask API) at http://localhost:5001
   - Frontend (Next.js) at http://localhost:3000

2. To stop the services:
   ```sh
   docker-compose down
   ```

### Notes
- The frontend is configured to call the backend at `http://localhost:5001`.
- If you need to rebuild after code changes, use:
   ```sh
   docker-compose up --build
   ```
- For development, you can still run each service locally as described above.
