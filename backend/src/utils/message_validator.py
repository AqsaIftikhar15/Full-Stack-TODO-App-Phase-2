"""Utility functions for validating messages according to requirements"""


def validate_message_length(message: str, max_length: int = 500) -> bool:
    """
    Validate that a message does not exceed the maximum length.

    Args:
        message: The message to validate
        max_length: Maximum allowed length (default 500 characters per spec)

    Returns:
        True if message is within length limit, False otherwise
    """
    if not isinstance(message, str):
        return False

    return len(message) <= max_length


def truncate_message_if_needed(message: str, max_length: int = 500) -> str:
    """
    Truncate a message if it exceeds the maximum length.

    Args:
        message: The message to truncate if needed
        max_length: Maximum allowed length (default 500 characters per spec)

    Returns:
        The original message if within limit, or truncated message
    """
    if not isinstance(message, str):
        return ""

    if len(message) <= max_length:
        return message

    return message[:max_length]


def get_message_length_error_details(message: str, max_length: int = 500) -> dict:
    """
    Get detailed information about message length validation.

    Args:
        message: The message to check
        max_length: Maximum allowed length (default 500 characters per spec)

    Returns:
        Dictionary with validation details
    """
    if not isinstance(message, str):
        return {
            "valid": False,
            "length": 0,
            "max_length": max_length,
            "excess": 0,
            "error": "Message must be a string"
        }

    length = len(message)
    excess = max(0, length - max_length)

    return {
        "valid": length <= max_length,
        "length": length,
        "max_length": max_length,
        "excess": excess,
        "can_truncate": excess > 0
    }