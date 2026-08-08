"""Output comparator for the judge.

Supports:
- Exact match (after stripping trailing whitespace/newlines)
- Floating-point tolerance comparison
"""
import math
import re


def _strip(text: str) -> str:
    return text.strip()


def _try_float(token: str) -> tuple[bool, float]:
    try:
        return True, float(token)
    except ValueError:
        return False, 0.0


def compare(actual: str, expected: str, float_tolerance: float = 1e-5) -> bool:
    """Return True if actual matches expected output.

    Rules applied in order:
    1. Exact match after stripping trailing whitespace.
    2. Token-by-token comparison with float tolerance for numeric tokens.
    """
    actual_s = _strip(actual)
    expected_s = _strip(expected)

    if actual_s == expected_s:
        return True

    # Token-by-token float comparison
    actual_tokens = actual_s.split()
    expected_tokens = expected_s.split()

    if len(actual_tokens) != len(expected_tokens):
        return False

    for a_tok, e_tok in zip(actual_tokens, expected_tokens):
        if a_tok == e_tok:
            continue
        a_is_float, a_val = _try_float(a_tok)
        e_is_float, e_val = _try_float(e_tok)
        if a_is_float and e_is_float:
            if math.isinf(a_val) or math.isinf(e_val) or math.isnan(a_val) or math.isnan(e_val):
                if a_val != e_val:
                    return False
            elif abs(a_val - e_val) > float_tolerance:
                return False
        else:
            return False

    return True


def is_output_too_large(output: str, limit_bytes: int) -> bool:
    return len(output.encode("utf-8")) > limit_bytes
