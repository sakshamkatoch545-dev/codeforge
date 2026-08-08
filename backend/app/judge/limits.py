"""Resource limits for sandbox containers."""
from dataclasses import dataclass


@dataclass
class Limits:
    time_limit_ms: int = 2000          # wall-clock timeout in ms
    memory_limit_mb: int = 256         # container memory cap in MB
    output_limit_bytes: int = 1_048_576  # 1 MB stdout cap
    pids_limit: int = 64               # max number of processes


DEFAULT_LIMITS = Limits()


def build_docker_resource_flags(limits: Limits) -> list[str]:
    """Return docker run flags that enforce the given resource limits."""
    return [
        "--memory", f"{limits.memory_limit_mb}m",
        "--memory-swap", f"{limits.memory_limit_mb}m",  # disable swap
        "--cpus", "1",
        "--pids-limit", str(limits.pids_limit),
        "--ulimit", "nofile=64:64",
    ]
