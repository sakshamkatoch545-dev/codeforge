"""Judge executor: orchestrates running code against all test cases.

Flow:
    1. Look up language config
    2. Compile (if needed) — done once outside the test case loop
    3. For each test case: run → compare → record verdict
    4. Return aggregate JudgeResult
"""
import logging
import time
from dataclasses import dataclass, field
from typing import Optional

from app.judge.comparator import compare, is_output_too_large
from app.judge.docker_runner import setup_sandbox_volume, compile_in_sandbox, execute_in_sandbox, cleanup_sandbox_volume, RunResult
from app.judge.languages import get_language, Language
from app.judge.limits import Limits, DEFAULT_LIMITS
from app.judge.verdict import Verdict

logger = logging.getLogger(__name__)


@dataclass
class TestCaseResult:
    test_case_id: int
    verdict: Verdict
    actual_output: str = ""
    expected_output: str = ""
    wall_time_ms: float = 0.0
    stderr: str = ""


@dataclass
class JudgeResult:
    verdict: Verdict
    passed: int = 0
    total: int = 0
    error_message: str = ""
    execution_time_ms: float = 0.0
    memory_mb: float = 0.0
    test_results: list[TestCaseResult] = field(default_factory=list)


def judge(
    code: str,
    language_key: str,
    test_cases: list[dict],  # each: {id, input_data, expected_output}
    limits: Limits = DEFAULT_LIMITS,
    driver_code: dict = None,
) -> JudgeResult:
    """Run code against all test cases and return a JudgeResult."""
    if driver_code is None:
        driver_code = {}

    lang = get_language(language_key)
    if lang is None:
        return JudgeResult(
            verdict=Verdict.INTERNAL_ERROR,
            error_message=f"Unsupported language: {language_key}",
        )

    # Wrap code if driver is provided for the language
    final_code = code
    if language_key.lower() in driver_code and driver_code[language_key.lower()]:
        # The driver code should have a placeholder like {USER_CODE}
        driver_template = driver_code[language_key.lower()]
        if "{USER_CODE}" in driver_template:
            final_code = driver_template.replace("{USER_CODE}", code)
        else:
            # Fallback if placeholder missing, prepend the code
            final_code = code + "\n" + driver_template

    logger.error("FINAL_CODE IS:\n%s", final_code)
    total = len(test_cases)
    results: list[TestCaseResult] = []
    passed = 0
    max_time_ms = 0.0

    try:
        volume_name = setup_sandbox_volume(final_code, lang)

        # ── Compilation step (if needed) ──
        compile_result = compile_in_sandbox(volume_name, lang, limits)
        if compile_result and (compile_result.exit_code != 0 or compile_result.timed_out):
            return JudgeResult(
                verdict=Verdict.COMPILATION_ERROR,
                passed=0,
                total=total,
                error_message=f"Compilation Error:\n{compile_result.stderr or 'Compilation timed out'}",
                execution_time_ms=compile_result.wall_time_ms,
            )

        for tc in test_cases:
            tc_id = tc.get("id", 0)
            input_data = tc.get("input_data", "")
            expected = tc.get("expected_output", "")

            run = execute_in_sandbox(volume_name, input_data, lang, limits)
            max_time_ms = max(max_time_ms, run.wall_time_ms)

            # ── Determine verdict for this test case ──
            if run.timed_out:
                tc_verdict = Verdict.TIME_LIMIT_EXCEEDED
            elif run.exit_code != 0:
                # Execution error
                tc_verdict = Verdict.RUNTIME_ERROR
            elif is_output_too_large(run.stdout, limits.output_limit_bytes):
                tc_verdict = Verdict.OUTPUT_LIMIT_EXCEEDED
            elif compare(run.stdout, expected):
                tc_verdict = Verdict.ACCEPTED
                passed += 1
            else:
                tc_verdict = Verdict.WRONG_ANSWER

            results.append(TestCaseResult(
                test_case_id=tc_id,
                verdict=tc_verdict,
                actual_output=run.stdout.strip(),
                expected_output=expected.strip(),
                wall_time_ms=run.wall_time_ms,
                stderr=run.stderr,
            ))

            # Stop early on non-accepted verdict
            if tc_verdict != Verdict.ACCEPTED:
                # Fill remaining as not run
                for remaining in test_cases[len(results):]:
                    results.append(TestCaseResult(
                        test_case_id=remaining.get("id", 0),
                        verdict=Verdict.PENDING,
                    ))
                break
    finally:
        # Guarantee cleanup even if we crash
        cleanup_sandbox_volume(volume_name)

    # ── Determine overall verdict ──
    final_verdict = Verdict.ACCEPTED
    error_msg = ""
    for r in results:
        if r.verdict != Verdict.ACCEPTED and r.verdict != Verdict.PENDING:
            final_verdict = r.verdict
            if r.verdict == Verdict.WRONG_ANSWER:
                error_msg = (
                    f"Wrong Answer on test case {r.test_case_id}.\n"
                    f"Expected:\n{r.expected_output}\n"
                    f"Got:\n{r.actual_output}"
                )
            elif r.verdict == Verdict.RUNTIME_ERROR:
                error_msg = f"Runtime Error on test case {r.test_case_id}:\n{r.stderr}"
            elif r.verdict == Verdict.COMPILATION_ERROR:
                error_msg = f"Compilation Error:\n{r.stderr}"
            elif r.verdict == Verdict.TIME_LIMIT_EXCEEDED:
                error_msg = f"Time Limit Exceeded on test case {r.test_case_id}"
            elif r.verdict == Verdict.OUTPUT_LIMIT_EXCEEDED:
                error_msg = f"Output Limit Exceeded on test case {r.test_case_id}"
            break

    return JudgeResult(
        verdict=final_verdict,
        passed=passed,
        total=total,
        error_message=error_msg,
        execution_time_ms=max_time_ms,
        test_results=results,
    )
