import tempfile
import subprocess
import os
from typing import Any
from pydantic import BaseModel
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.api import deps
from app import models

router = APIRouter()

class RunCodeRequest(BaseModel):
    code: str
    language: str
    input_data: str = ""

class RunCodeResponse(BaseModel):
    output: str
    error: str
    status: str

@router.post("/", response_model=RunCodeResponse)
def run_code(
    *,
    request: RunCodeRequest,
    current_user: models.User = Depends(deps.get_current_active_user),
) -> Any:
    """
    Execute code and return the standard output and error.
    """
    if request.language not in ["python", "javascript", "c", "cpp", "java"]:
        raise HTTPException(status_code=400, detail="Unsupported language")

    output = ""
    error = ""
    status = "SUCCESS"

    with tempfile.TemporaryDirectory() as temp_dir:
        cmd = []
        if request.language == "python":
            file_path = os.path.join(temp_dir, "script.py")
            cmd = ["python", file_path]
            with open(file_path, "w") as f:
                f.write(request.code)
        elif request.language == "javascript":
            file_path = os.path.join(temp_dir, "script.js")
            cmd = ["node", file_path]
            with open(file_path, "w") as f:
                f.write(request.code)
        elif request.language == "c":
            file_path = os.path.join(temp_dir, "main.c")
            out_path = os.path.join(temp_dir, "a.exe")
            with open(file_path, "w") as f:
                f.write(request.code)
            # Compile
            compile_res = subprocess.run(["gcc", "-O2", "-o", out_path, file_path], capture_output=True, text=True)
            if compile_res.returncode != 0:
                return RunCodeResponse(output="", error=compile_res.stderr, status="COMPILATION_ERROR")
            cmd = [out_path]
        elif request.language == "cpp":
            file_path = os.path.join(temp_dir, "main.cpp")
            out_path = os.path.join(temp_dir, "a.exe")
            with open(file_path, "w") as f:
                f.write(request.code)
            # Compile
            compile_res = subprocess.run(["g++", "-O2", "-o", out_path, file_path], capture_output=True, text=True)
            if compile_res.returncode != 0:
                return RunCodeResponse(output="", error=compile_res.stderr, status="COMPILATION_ERROR")
            cmd = [out_path]
        elif request.language == "java":
            file_path = os.path.join(temp_dir, "Main.java")
            with open(file_path, "w") as f:
                f.write(request.code)
            # Compile
            compile_res = subprocess.run(["javac", file_path], capture_output=True, text=True)
            if compile_res.returncode != 0:
                return RunCodeResponse(output="", error=compile_res.stderr, status="COMPILATION_ERROR")
            cmd = ["java", "-cp", temp_dir, "Main"]
            
        try:
            # We add a 5 second timeout to prevent infinite loops from hanging the backend
            result = subprocess.run(cmd, input=request.input_data, capture_output=True, text=True, timeout=5)
            output = result.stdout
            error = result.stderr
            if result.returncode != 0:
                status = "ERROR"
        except subprocess.TimeoutExpired:
            error = "Execution timed out (5s limit)."
            status = "TIMEOUT"
        except Exception as e:
            error = str(e)
            status = "SYSTEM_ERROR"
            
    return RunCodeResponse(output=output, error=error, status=status)
