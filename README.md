# CodeForge

A full-stack, production-ready coding practice platform featuring a Docker-isolated code judge, real-time leaderboard, discussions, and AI-powered hints.

## Tech Stack

- **Frontend**: React, Vite, TypeScript, Tailwind CSS, Framer Motion, Monaco Editor
- **Backend**: FastAPI, Python 3.12, SQLAlchemy, Pydantic
- **Database**: PostgreSQL (Production), SQLite (Development)
- **Judge Engine**: Docker-based secure sandbox execution (Python, C++, Java, JS)

## Quick Start (Docker)

1. Clone the repository.
2. Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```
3. Run with Docker Compose:
   ```bash
   docker-compose up -d --build
   ```
4. Access the platform:
   - Frontend: `http://localhost:3000`
   - Backend API Docs: `http://localhost:8000/docs`

## Local Development (Without Docker Compose)

### Backend
1. Navigate to `backend/`:
   ```bash
   cd backend
   ```
2. Create virtual environment and install dependencies:
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   pip install -r requirements.txt
   ```
3. Run Alembic migrations (make sure DB is running):
   ```bash
   alembic upgrade head
   ```
4. Start FastAPI server:
   ```bash
   uvicorn app.main:app --reload
   ```

### Frontend
1. Navigate to `frontend/`:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start development server:
   ```bash
   npm run dev
   ```

## Documentation
- Architecture overview can be found in `docs/architecture.md` (to be created)
- API documentation is available at `/docs` when the backend is running.
