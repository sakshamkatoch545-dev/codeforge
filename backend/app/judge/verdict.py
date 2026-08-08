"""Verdict definitions and mapping logic."""
from enum import Enum


class Verdict(str, Enum):
    ACCEPTED = "ACCEPTED"
    WRONG_ANSWER = "WRONG_ANSWER"
    RUNTIME_ERROR = "RUNTIME_ERROR"
    COMPILATION_ERROR = "COMPILATION_ERROR"
    TIME_LIMIT_EXCEEDED = "TIME_LIMIT_EXCEEDED"
    MEMORY_LIMIT_EXCEEDED = "MEMORY_LIMIT_EXCEEDED"
    OUTPUT_LIMIT_EXCEEDED = "OUTPUT_LIMIT_EXCEEDED"
    INTERNAL_ERROR = "INTERNAL_ERROR"
    PENDING = "PENDING"
    RUNNING = "RUNNING"


VERDICT_MESSAGES: dict[str, str] = {
    Verdict.ACCEPTED: "All test cases passed!",
    Verdict.WRONG_ANSWER: "Output does not match expected output.",
    Verdict.RUNTIME_ERROR: "Your program crashed during execution.",
    Verdict.COMPILATION_ERROR: "Your code failed to compile.",
    Verdict.TIME_LIMIT_EXCEEDED: "Your program took too long to run.",
    Verdict.MEMORY_LIMIT_EXCEEDED: "Your program exceeded the memory limit.",
    Verdict.OUTPUT_LIMIT_EXCEEDED: "Your program produced too much output.",
    Verdict.INTERNAL_ERROR: "An internal judge error occurred.",
}


def from_exit_code(exit_code: int, timed_out: bool = False) -> Verdict:
    """Map a subprocess exit code to a verdict."""
    if timed_out:
        return Verdict.TIME_LIMIT_EXCEEDED
    if exit_code == 0:
        return Verdict.ACCEPTED  # caller still needs to check output
    if exit_code in (137, 139):  # SIGKILL / SIGSEGV
        return Verdict.RUNTIME_ERROR
    return Verdict.RUNTIME_ERROR
