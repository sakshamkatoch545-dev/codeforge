<div align="center">
  <h1>🚀 CodeForge</h1>
  <p><em>A full-stack, production-ready coding practice platform featuring a Docker-isolated code judge, real-time leaderboard, discussions, and AI-powered hints.</em></p>
</div>

---

## 🛠️ Tech Stack

| Domain | Technologies |
| :--- | :--- |
| **Frontend** | React, Vite, TypeScript, Tailwind CSS, Framer Motion, Monaco Editor |
| **Backend** | FastAPI, Python 3.12, SQLAlchemy, Pydantic |
| **Database** | PostgreSQL (Production), SQLite (Development) |
| **Judge Engine** | Docker-based secure sandbox execution (Python, C++, Java, JS) |

---

## ⚡ Quick Start (Docker)

Get up and running in minutes with Docker Compose:

1. **Clone the repository**
2. **Setup environment variables**:
   ```bash
   cp .env.example .env
   ```
3. **Run with Docker Compose**:
   ```bash
   docker-compose up -d --build
   ```
4. **Access the platform**:
   - 🌐 **Frontend**: [http://localhost:3000](http://localhost:3000)
   - 📖 **Backend API Docs**: [http://localhost:8000/docs](http://localhost:8000/docs)
   - 📊 **Admin Dashboard**: [http://localhost:8501](http://localhost:8501)

---

## 💻 Local Development (Without Docker Compose)

> [!TIP]
> Use these steps if you want to run the services individually for active development.

### 🔌 Backend
```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
alembic upgrade head      # Ensure DB is running first
uvicorn app.main:app --reload
```

### 🎨 Frontend
```bash
cd frontend
npm install
npm run dev
```

### 📈 Admin Dashboard
```bash
cd admin_dashboard
pip install -r requirements.txt
streamlit run app.py
```

---

## ✨ Features

### 🚀 Core Platform
- 🔒 **Secure Code Execution**: Isolated Docker containers evaluate user submissions safely, limiting CPU and memory usage to protect the host.
- 🌍 **Multi-Language Support**: Execute Python, JavaScript, Java, and C++ out of the box. Easily extensible for new languages.
- 🏆 **Real-Time Leaderboard**: Competitive ranking system driven by problem difficulty, completions, and execution time.
- 📊 **Admin Dashboard**: A Streamlit interface to manage users, add problems, and view site analytics.

### 💡 Interactive Learning
- 🤖 **AI-Powered Hints**: LLM-integrated explanations tailored to user errors, guiding without revealing the full answer.
- 💬 **Discussion Forums**: Threaded problem discussions for sharing approaches, asking questions, and upvoting solutions.
- ⌨️ **Rich Code Editor**: Monaco-editor (VS Code engine) integration with syntax highlighting, auto-completion, and themes.
- 📉 **Execution Analytics**: Detailed metrics on execution time, memory usage, and error tracebacks.
- 🎨 **Enhanced User Profiles**: A completely redesigned profile page with detailed statistics, recent submissions, and a visual heatmap of coding activity.

---

## 🏗️ Architecture

CodeForge utilizes a decoupled microservices architecture for scalability and security:

1. **Frontend Client**: React/Vite app communicating via REST and WebSockets (for live leaderboard/submission status).
2. **Backend API**: FastAPI gateway handling business logic, JWT authentication, and DB interactions.
3. **Judge Engine**: Background worker that spins up ephemeral, sandboxed Docker containers to evaluate code against hidden test cases.
4. **Database (PostgreSQL)**: Primary store for users, problems, test cases, and discussions.
5. **Cache & Queue (Redis)**: Manages API rate-limiting, sessions, and task queuing for the judge engine.

---

## 🔌 Key API Endpoints

Once the backend is running, the interactive Swagger UI is available at `/docs`.

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `POST` | `/api/v1/auth/login` | Authenticate and receive a JWT token |
| `POST` | `/api/v1/auth/register`| Create a new user account |
| `GET`  | `/api/v1/problems`     | Paginated list of available problems |
| `GET`  | `/api/v1/problems/{id}`| Detailed problem constraints and skeleton code |
| `POST` | `/api/v1/submissions`  | Submit a code solution for evaluation |
| `GET`  | `/api/v1/submissions/{id}`| Poll for submission status |
| `GET`  | `/api/v1/leaderboard`  | Global user rankings |

---

## ⚙️ Environment Variables

A sample `.env.example` is provided in the root directory. Key variables include:

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

# Optional: AI Integration
OPENAI_API_KEY=your_openai_key_here
```

---

## 🤝 Contributing

We welcome community contributions! To get started:

1. **Fork** the repository.
2. **Create a branch**: `git checkout -b feature/amazing-feature`.
3. **Commit changes**: `git commit -m 'Add amazing feature'`.
4. **Push**: `git push origin feature/amazing-feature`.
5. **Open a PR**: Submit a detailed Pull Request.

> [!NOTE]
> Ensure your code passes all linting rules and tests before opening a PR. For major changes, please open an issue first to discuss your ideas.

---

## 📄 License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for more details.
