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
   - Admin Dashboard: `http://localhost:8501`

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

### Admin Dashboard
1. Navigate to `admin_dashboard/`:
   ```bash
   cd admin_dashboard
   ```
2. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
3. Run Streamlit app:
   ```bash
   streamlit run app.py
   ```

## Documentation
- Architecture overview can be found in `docs/architecture.md` (to be created)
- API documentation is available at `/docs` when the backend is running.

## Features

### 🚀 Core Platform
- **Secure Code Execution**: Isolated Docker containers for evaluating user submissions safely. Limits CPU and memory usage to prevent malicious code from impacting the host.
- **Multi-Language Support**: Currently supporting Python, JavaScript, Java, and C++. Easily extensible architecture allows adding new language runtimes by defining a new Docker image.
- **Real-Time Leaderboard**: Competitive ranking system based on problem difficulty, successful completions, and execution time.
- **Integrated Admin Dashboard**: Streamlit-powered dashboard for managing users, adding new problems, and viewing real-time site analytics.

### 💡 Interactive Learning
- **AI-Powered Hints**: LLM-integrated hints and code explanations tailored to the user's specific errors, guiding them without giving away the direct answer.
- **Discussion Forums**: Threaded discussions for each problem, allowing users to share approaches, ask questions, and upvote helpful answers.
- **Rich Code Editor**: Monaco-editor integration (the core of VS Code) with syntax highlighting, auto-completion, snippet support, and customizable themes.
- **Detailed Execution Analytics**: View execution time, memory usage, and detailed error tracebacks to help optimize solutions.

## Architecture

CodeForge follows a modern, decoupled microservices architecture designed for scalability, security, and ease of maintenance:

1. **Frontend Client (React/Vite)**: 
   - Handles the UI/UX, routing, and state management. Communicates with the backend via RESTful endpoints and uses WebSockets for real-time updates (like submission status and leaderboard changes).
2. **Backend API (FastAPI)**: 
   - Serves as the main gateway. It manages business logic, secure authentication (JWT), role-based access control, and database interactions using SQLAlchemy.
3. **Execution Judge Engine**: 
   - A highly secure, specialized background worker system. When a submission is created, the backend enqueues a job. The Judge picks it up, spins up a temporary, sandboxed Docker container, executes the user code against predefined, hidden test cases, captures the standard output/error, and reports the verdict (Accepted, Wrong Answer, Time Limit Exceeded, etc.).
4. **Relational Database (PostgreSQL)**:
   - The primary data store for users, problems, test cases, submissions, and discussion threads. Optimized with appropriate indexing for fast queries.
5. **Caching & Message Queue (Redis)**:
   - Used for rate-limiting API requests, managing active sessions, and serving as the message broker for the execution queue.

## Key API Endpoints

The API is fully documented using OpenAPI standard. Once the backend is running, visit `/docs` for the interactive Swagger UI. Below are some of the core endpoints:

- `POST /api/v1/auth/login`: Authenticate a user and receive a JWT access token.
- `POST /api/v1/auth/register`: Create a new user account.
- `GET /api/v1/problems`: Retrieve a paginated list of available problems with filtering and sorting.
- `GET /api/v1/problems/{id}`: Fetch detailed problem descriptions, constraints, and skeleton code.
- `POST /api/v1/submissions`: Submit a code solution for evaluation.
- `GET /api/v1/submissions/{id}`: Poll for the status and results of a specific submission.
- `GET /api/v1/leaderboard`: Fetch the global ranking of users, sorted by score.

## Environment Variables

To properly configure the application for local development or production, you need to set up your environment variables. A sample `.env.example` is provided in the root directory. Key variables include:

```env
# Database Configuration
POSTGRES_USER=postgres
POSTGRES_PASSWORD=postgres
POSTGRES_DB=codeforge
DATABASE_URL=postgresql://postgres:postgres@db:5432/codeforge

# Security & Authentication
SECRET_KEY=your_super_secret_key_here
ACCESS_TOKEN_EXPIRE_MINUTES=1440

# Redis Connection
REDIS_URL=redis://redis:6379/0

# Optional: AI Integration (for hints)
OPENAI_API_KEY=your_openai_key_here
```

## Contributing

We welcome contributions from the community! Whether it's a bug fix, new feature, or adding a new coding problem, please follow these steps:

1. **Fork the Repository**: Create your own fork of the project on GitHub.
2. **Create a Feature Branch**: `git checkout -b feature/amazing-feature`.
3. **Commit your Changes**: `git commit -m 'Add amazing feature'`.
4. **Push to the Branch**: `git push origin feature/amazing-feature`.
5. **Open a Pull Request**: Submit your PR for review. Provide a clear description of your changes.

Please ensure your code passes all linting rules and tests before opening a PR. For major architectural changes, open an issue first to discuss what you would like to change.

## License

This project is licensed under the MIT License. See the `LICENSE` file for more details.
