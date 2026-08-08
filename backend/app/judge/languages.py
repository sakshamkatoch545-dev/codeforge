"""Language configuration for the CodeForge judge.

Each entry defines:
- image: Docker image to use
- compile: shell command to compile (None for interpreted)
- run: shell command to run the code
- source_file: source filename inside the container
- output_file: compiled output filename (None for interpreted)
- timeout_multiplier: extra factor for compile step
"""
from typing import Optional
from dataclasses import dataclass, field


@dataclass
class Language:
    name: str
    image: str
    source_file: str
    run_cmd: str
    compile_cmd: Optional[str] = None
    output_file: Optional[str] = None
    timeout_multiplier: float = 1.0


LANGUAGES: dict[str, Language] = {
    "python": Language(
        name="Python 3",
        image="python:3.11-alpine",
        source_file="solution.py",
        run_cmd="python solution.py",
        timeout_multiplier=3.0,
    ),
    "javascript": Language(
        name="JavaScript (Node.js)",
        image="node:20-alpine",
        source_file="solution.js",
        run_cmd="node solution.js",
        timeout_multiplier=3.0,
    ),
    "c": Language(
        name="C (GCC)",
        image="gcc:13-bookworm",
        source_file="solution.c",
        output_file="solution_out",
        compile_cmd="gcc -O2 -o solution_out solution.c -lm",
        run_cmd="./solution_out",
        timeout_multiplier=2.0,
    ),
    "cpp": Language(
        name="C++ (G++)",
        image="gcc:13-bookworm",
        source_file="solution.cpp",
        output_file="solution_out",
        compile_cmd="g++ -O2 -std=c++17 -o solution_out solution.cpp",
        run_cmd="./solution_out",
        timeout_multiplier=2.0,
    ),
    "java": Language(
        name="Java",
        image="eclipse-temurin:21-jre-alpine",
        source_file="Solution.java",
        output_file="Solution.class",
        compile_cmd="javac Solution.java",
        run_cmd="java Solution",
        timeout_multiplier=3.0,
    ),
    "go": Language(
        name="Go",
        image="golang:1.22-alpine",
        source_file="solution.go",
        output_file="solution_out",
        compile_cmd="go build -o solution_out solution.go",
        run_cmd="./solution_out",
        timeout_multiplier=2.0,
    ),
    "rust": Language(
        name="Rust",
        image="rust:1.77-alpine",
        source_file="solution.rs",
        output_file="solution_out",
        compile_cmd="rustc -O -o solution_out solution.rs",
        run_cmd="./solution_out",
        timeout_multiplier=3.0,
    ),
}


def get_language(lang_key: str) -> Optional[Language]:
    """Return Language config or None if unsupported."""
    return LANGUAGES.get(lang_key.lower())


def supported_languages() -> list[str]:
    return list(LANGUAGES.keys())
