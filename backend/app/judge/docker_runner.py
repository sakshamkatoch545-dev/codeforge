"""Docker sandbox runner.

Runs user code inside an isolated Docker container with:
- No network access (--network none)
- Read-only filesystem (--read-only) with a tmpfs /tmp
- CPU, memory, PID limits
- Wall-clock timeout via subprocess
- Automatic container cleanup (--rm)
"""
import logging
import os
import subprocess
import tempfile
import time
import base64
from pathlib import Path
from typing import Optional

from app.judge.languages import Language
from app.judge.limits import Limits, build_docker_resource_flags

logger = logging.getLogger(__name__)

OUTPUT_LIMIT = 1_048_576  # 1 MB


class RunResult:
    def __init__(
        self,
        stdout: str,
        stderr: str,
        exit_code: int,
        timed_out: bool,
        wall_time_ms: float,
    ):
        self.stdout = stdout
        self.stderr = stderr
        self.exit_code = exit_code
        self.timed_out = timed_out
        self.wall_time_ms = wall_time_ms

    @property
    def success(self) -> bool:
        return self.exit_code == 0 and not self.timed_out


def setup_sandbox_volume(code: str, language: Language) -> str:
    """Create a named volume and inject the code into it."""
    volume_name = f"sandbox_vol_{os.urandom(8).hex()}"
    subprocess.run(["docker", "volume", "create", volume_name], check=True, capture_output=True)
    
    code_b64 = base64.b64encode(code.encode("utf-8")).decode("utf-8")
    inject_cmd = [
        "docker", "run", "--rm",
        "-v", f"{volume_name}:/code",
        "-e", f"CODE_B64={code_b64}",
        "alpine",
        "/bin/sh", "-c", f"echo $CODE_B64 | base64 -d > /code/{language.source_file}"
    ]
    subprocess.run(inject_cmd, check=True, capture_output=True)
    return volume_name

def compile_in_sandbox(volume_name: str, language: Language, limits: Limits) -> Optional[RunResult]:
    """Run the compilation step in a Docker container using the volume."""
    if not language.compile_cmd:
        return None
        
    compile_result = _run_docker(
        image=language.image,
        cmd=language.compile_cmd,
        workdir="/code",
        volume_mount=f"{volume_name}:/code",
        stdin_data="",
        timeout_s=(limits.time_limit_ms / 1000.0) * language.timeout_multiplier,
        limits=limits,
    )
    return compile_result

def execute_in_sandbox(volume_name: str, stdin_data: str, language: Language, limits: Limits) -> RunResult:
    """Run the code in a Docker container using the volume."""
    return _run_docker(
        image=language.image,
        cmd=language.run_cmd,
        workdir="/code",
        volume_mount=f"{volume_name}:/code:ro",  # read-only for run step
        stdin_data=stdin_data,
        timeout_s=(limits.time_limit_ms / 1000.0) * language.timeout_multiplier,
        limits=limits,
    )

def cleanup_sandbox_volume(volume_name: str):
    """Remove the Docker volume."""
    subprocess.run(["docker", "volume", "rm", volume_name], check=False, capture_output=True)


def _run_docker(
    image: str,
    cmd: str,
    workdir: str,
    volume_mount: str,
    stdin_data: str,
    timeout_s: float,
    limits: Limits,
) -> RunResult:
    resource_flags = build_docker_resource_flags(limits)
    docker_cmd = [
        "docker", "run",
        "--rm",
        "--network", "none",
        "--read-only",
        "--tmpfs", "/tmp:rw,size=64m,mode=1777",
        "-w", workdir,
        "-v", volume_mount,
        "--interactive",
        *resource_flags,
        image,
        "/bin/sh", "-c", cmd,
    ]

    start = time.monotonic()
    try:
        proc = subprocess.run(
            docker_cmd,
            input=stdin_data,
            text=True,
            capture_output=True,
            timeout=timeout_s + 5,  # extra grace period for docker startup
        )
        elapsed_ms = (time.monotonic() - start) * 1000
        # Deduct ~800ms of known docker overhead so the reported time is closer to actual execution
        adjusted_ms = max(1.0, elapsed_ms - 800.0)
        
        stdout = proc.stdout[:OUTPUT_LIMIT]
        stderr = proc.stderr[:OUTPUT_LIMIT]
        return RunResult(
            stdout=stdout,
            stderr=stderr,
            exit_code=proc.returncode,
            timed_out=elapsed_ms > (timeout_s * 1000 + 1000), # 1s grace period for docker overhead
            wall_time_ms=adjusted_ms,
        )
    except subprocess.TimeoutExpired:
        elapsed_ms = (time.monotonic() - start) * 1000
        adjusted_ms = max(1.0, elapsed_ms - 800.0)
        logger.warning("Docker run timed out after %.0fms", elapsed_ms)
        return RunResult(
            stdout="",
            stderr="Time Limit Exceeded",
            exit_code=124,
            timed_out=True,
            wall_time_ms=adjusted_ms,
        )
    except Exception as e:
        logger.exception("Docker run failed: %s", e)
        return RunResult(
            stdout="",
            stderr=f"Internal error: {e}",
            exit_code=-1,
            timed_out=False,
            wall_time_ms=0,
        )
