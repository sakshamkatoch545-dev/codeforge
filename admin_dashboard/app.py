# pyrefly: ignore [missing-import]
import streamlit as st
import pandas as pd
from sqlalchemy import create_engine
import os

st.set_page_config(page_title="CodeForge Admin Dashboard", layout="wide")

DATABASE_URL = os.getenv("DATABASE_URL", "postgresql://postgres:postgres@db:5432/codeforge")

@st.cache_resource
def get_engine():
    return create_engine(DATABASE_URL)

engine = get_engine()

st.title("CodeForge Admin Dashboard")

tab1, tab2, tab3 = st.tabs(["Overview", "Users", "Problems"])

with tab1:
    st.header("Overview")
    col1, col2, col3 = st.columns(3)
    
    try:
        user_count = pd.read_sql("SELECT COUNT(*) FROM \"user\"", engine).iloc[0, 0]
        problem_count = pd.read_sql("SELECT COUNT(*) FROM problem", engine).iloc[0, 0]
        submission_count = pd.read_sql("SELECT COUNT(*) FROM submission", engine).iloc[0, 0]
        
        col1.metric("Total Users", user_count)
        col2.metric("Total Problems", problem_count)
        col3.metric("Total Submissions", submission_count)
        
        st.subheader("Recent Submissions")
        submissions = pd.read_sql("SELECT id, user_id, problem_id, language, status, execution_time, created_at FROM submission ORDER BY created_at DESC LIMIT 10", engine)
        st.dataframe(submissions, use_container_width=True)
    except Exception as e:
        st.error(f"Error loading overview data: {e}")

with tab2:
    st.header("Users")
    try:
        users = pd.read_sql("SELECT id, email, username, is_active, is_superuser, created_at FROM \"user\" ORDER BY created_at DESC", engine)
        st.dataframe(users, use_container_width=True)
    except Exception as e:
        st.error(f"Error loading users: {e}")

with tab3:
    st.header("Problems")
    try:
        problems = pd.read_sql("SELECT id, title, difficulty, time_limit, memory_limit, created_at FROM problem ORDER BY id", engine)
        st.dataframe(problems, use_container_width=True)
    except Exception as e:
        st.error(f"Error loading problems: {e}")
