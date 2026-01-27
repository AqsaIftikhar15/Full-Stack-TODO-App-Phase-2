"""Rate limiting utility for controlling concurrent AI requests per user"""

import time
from collections import defaultdict, deque
from threading import Lock
from typing import Dict
import uuid


class RateLimiter:
    """
    A rate limiter to control concurrent requests per user.
    Implements a sliding window algorithm to track requests.
    """

    def __init__(self, max_requests: int = 3, time_window: int = 60):
        """
        Initialize the rate limiter.

        Args:
            max_requests: Maximum number of requests allowed per time window
            time_window: Time window in seconds
        """
        self.max_requests = max_requests
        self.time_window = time_window
        self.requests: Dict[str, deque] = defaultdict(deque)  # user_id -> deque of timestamps
        self.lock = Lock()

    def is_allowed(self, user_id: str) -> bool:
        """
        Check if a request from the given user is allowed.

        Args:
            user_id: The ID of the user making the request

        Returns:
            True if the request is allowed, False otherwise
        """
        with self.lock:
            current_time = time.time()

            # Clean up old requests outside the time window
            while (self.requests[user_id] and
                   current_time - self.requests[user_id][0] > self.time_window):
                self.requests[user_id].popleft()

            # Check if we're under the limit
            if len(self.requests[user_id]) < self.max_requests:
                # Add the current request
                self.requests[user_id].append(current_time)
                return True

            return False

    def get_remaining_requests(self, user_id: str) -> int:
        """
        Get the number of remaining requests for the user in the current window.

        Args:
            user_id: The ID of the user

        Returns:
            Number of remaining requests
        """
        with self.lock:
            current_time = time.time()

            # Clean up old requests
            while (self.requests[user_id] and
                   current_time - self.requests[user_id][0] > self.time_window):
                self.requests[user_id].popleft()

            return self.max_requests - len(self.requests[user_id])

    def reset_user(self, user_id: str):
        """
        Reset the request counter for a user.

        Args:
            user_id: The ID of the user to reset
        """
        with self.lock:
            if user_id in self.requests:
                del self.requests[user_id]


# Global rate limiter instance for controlling concurrent AI requests
# Max 3 concurrent requests per user as specified in requirements
ai_request_limiter = RateLimiter(max_requests=3, time_window=60)


def check_ai_request_limit(user_id: str) -> bool:
    """
    Check if the user is allowed to make an AI request.

    Args:
        user_id: The ID of the user making the request

    Returns:
        True if the request is allowed, False otherwise
    """
    return ai_request_limiter.is_allowed(user_id)


def get_remaining_ai_requests(user_id: str) -> int:
    """
    Get the number of remaining AI requests for the user.

    Args:
        user_id: The ID of the user

    Returns:
        Number of remaining AI requests
    """
    return ai_request_limiter.get_remaining_requests(user_id)