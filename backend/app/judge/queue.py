"""Redis-backed submission queue.

Producer (API): push submission ID onto the queue.
Consumer (worker): pop IDs and judge them.
"""
import logging
import os
from typing import Optional

import redis

logger = logging.getLogger(__name__)

QUEUE_NAME = "judge_queue"
REDIS_URL = os.getenv("REDIS_URL", "redis://localhost:6379/0")

_pool: Optional[redis.ConnectionPool] = None


def _get_client() -> redis.Redis:
    global _pool
    if _pool is None:
        _pool = redis.ConnectionPool.from_url(REDIS_URL)
    return redis.Redis(connection_pool=_pool)


def push_submission(submission_id: int) -> None:
    """Push a submission ID to the back of the judge queue."""
    try:
        r = _get_client()
        r.rpush(QUEUE_NAME, submission_id)
        logger.info("Queued submission %d", submission_id)
    except redis.RedisError as e:
        logger.error("Failed to push submission %d to queue: %s", submission_id, e)
        raise


def pop_submission(timeout: int = 5) -> Optional[int]:
    """Blocking pop from the front of the judge queue.
    Returns submission ID or None on timeout.
    """
    try:
        r = _get_client()
        result = r.blpop(QUEUE_NAME, timeout=timeout)
        if result:
            _, value = result
            return int(value)
        return None
    except redis.RedisError as e:
        logger.error("Failed to pop from queue: %s", e)
        return None


def queue_length() -> int:
    """Return the current number of items in the queue."""
    try:
        return _get_client().llen(QUEUE_NAME)
    except redis.RedisError:
        return -1
