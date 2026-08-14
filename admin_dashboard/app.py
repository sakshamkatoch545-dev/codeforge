# pyrefly: ignore [missing-import]
import streamlit as st
import pandas as pd
from sqlalchemy import create_engine
import os

st.set_page_config(
    page_title="CodeForge Admin",
    layout="centered",          # "centered" is much friendlier on narrow screens
    initial_sidebar_state="collapsed",
)

# ── Mobile-friendly CSS ────────────────────────────────────────────────────────
st.markdown("""
<style>
/* Make the main block full-width on small screens */
@media (max-width: 768px) {
    .block-container {
        padding: 1rem 0.75rem !important;
        max-width: 100% !important;
    }
    /* Stack metric cards vertically */
    div[data-testid="stMetric"] {
        width: 100% !important;
    }
    /* Tighten tab labels */
    button[data-baseweb="tab"] {
        font-size: 0.78rem !important;
        padding: 0.35rem 0.5rem !important;
    }
    /* Horizontal scroll for tables instead of overflow-hidden */
    div[data-testid="stDataFrame"] > div {
        overflow-x: auto !important;
        -webkit-overflow-scrolling: touch;
    }
}

/* Metric cards — card-like look on all screen sizes */
div[data-testid="stMetric"] {
    background: #1e1e2e;
    border: 1px solid #313145;
    border-radius: 12px;
    padding: 1rem;
    text-align: center;
}
div[data-testid="stMetricLabel"] { font-size: 0.82rem; opacity: 0.7; }
div[data-testid="stMetricValue"] { font-size: 1.6rem; font-weight: 700; }
</style>
""", unsafe_allow_html=True)

DATABASE_URL = os.getenv("DATABASE_URL", "postgresql://postgres:postgres@db:5432/codeforge")

@st.cache_resource
def get_engine():
    return create_engine(DATABASE_URL)

engine = get_engine()

st.title("⚙️ CodeForge Admin")

tab1, tab2, tab3 = st.tabs(["📊 Overview", "👤 Users", "🧩 Problems"])

# ── Overview ───────────────────────────────────────────────────────────────────
with tab1:
    st.header("Overview")
    try:
        user_count       = pd.read_sql('SELECT COUNT(*) FROM "user"',    engine).iloc[0, 0]
        problem_count    = pd.read_sql("SELECT COUNT(*) FROM problem",    engine).iloc[0, 0]
        submission_count = pd.read_sql("SELECT COUNT(*) FROM submission", engine).iloc[0, 0]

        # 3 columns on desktop → stacked on mobile via CSS above
        col1, col2, col3 = st.columns(3)
        col1.metric("👥 Users",       user_count)
        col2.metric("🧩 Problems",    problem_count)
        col3.metric("📨 Submissions", submission_count)

        st.subheader("Recent Submissions")

        # Trimmed columns — easier to scroll horizontally on mobile
        submissions = pd.read_sql(
            """
            SELECT id, user_id, problem_id, language, status,
                   ROUND(execution_time::numeric, 2) AS exec_ms,
                   created_at::date AS date
            FROM submission
            ORDER BY created_at DESC
            LIMIT 20
            """,
            engine,
        )
        st.dataframe(submissions, use_container_width=True, height=300)

    except Exception as e:
        st.error(f"Error loading overview data: {e}")

# ── Users ──────────────────────────────────────────────────────────────────────
with tab2:
    st.header("Users")
    try:
        # Search / filter — very useful on mobile where scrolling large tables is tedious
        search = st.text_input("🔍 Search by username or email", "")

        users = pd.read_sql(
            'SELECT id, username, email, is_active, is_superuser, created_at::date AS joined FROM "user" ORDER BY created_at DESC',
            engine,
        )

        if search:
            mask = (
                users["username"].str.contains(search, case=False, na=False) |
                users["email"].str.contains(search, case=False, na=False)
            )
            users = users[mask]

        st.caption(f"{len(users)} user(s)")
        st.dataframe(users, use_container_width=True, height=400)

    except Exception as e:
        st.error(f"Error loading users: {e}")

# ── Problems ───────────────────────────────────────────────────────────────────
with tab3:
    st.header("Problems")
    try:
        difficulty_filter = st.selectbox("Filter by difficulty", ["All", "easy", "medium", "hard"])

        problems = pd.read_sql(
            "SELECT id, title, difficulty, time_limit, memory_limit, created_at::date AS created FROM problem ORDER BY id",
            engine,
        )

        if difficulty_filter != "All":
            problems = problems[problems["difficulty"] == difficulty_filter]

        st.caption(f"{len(problems)} problem(s)")
        st.dataframe(problems, use_container_width=True, height=400)

    except Exception as e:
        st.error(f"Error loading problems: {e}")
