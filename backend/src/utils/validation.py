from typing import List, Dict, Any, Optional
from datetime import datetime
from pydantic import BaseModel, validator, ValidationError
from ..models.task import PriorityEnum


class TaskValidator:
    @staticmethod
    def validate_priority(priority: str) -> bool:
        """Validate that priority is one of the allowed values."""
        try:
            PriorityEnum(priority)
            return True
        except ValueError:
            return False

    @staticmethod
    def validate_tags(tags: List[str]) -> Dict[str, Any]:
        """Validate tags according to business rules."""
        errors = []
        
        if len(tags) > 10:
            errors.append("Maximum 10 tags per task allowed")
            
        for i, tag in enumerate(tags):
            if not isinstance(tag, str):
                errors.append(f"Tag at index {i} must be a string")
            elif len(tag) < 1 or len(tag) > 50:
                errors.append(f"Tag '{tag}' must be between 1 and 50 characters")
            elif not tag.replace('-', '').replace('_', '').isalnum():
                errors.append(f"Tag '{tag}' must be alphanumeric with hyphens/underscores only")
        
        # Check for duplicates
        if len(tags) != len(set(tags)):
            errors.append("Duplicate tags are not allowed")
        
        return {
            "is_valid": len(errors) == 0,
            "errors": errors
        }

    @staticmethod
    def validate_due_date(due_date: Optional[datetime]) -> Dict[str, Any]:
        """Validate due date is in the future if provided."""
        if due_date is None:
            return {"is_valid": True, "errors": []}
        
        if due_date < datetime.utcnow():
            return {
                "is_valid": False,
                "errors": ["Due date must be in the future"]
            }
        
        return {"is_valid": True, "errors": []}

    @staticmethod
    def validate_reminder_config(reminder_config: Optional[Dict]) -> Dict[str, Any]:
        """Validate reminder configuration."""
        if reminder_config is None:
            return {"is_valid": True, "errors": []}
        
        errors = []
        
        if not isinstance(reminder_config, dict):
            return {
                "is_valid": False,
                "errors": ["Reminder config must be a dictionary"]
            }
        
        enabled = reminder_config.get('enabled', False)
        if not isinstance(enabled, bool):
            errors.append("'enabled' field must be boolean")
        
        if enabled:
            notify_before = reminder_config.get('notify_before')
            if notify_before is not None:
                if not isinstance(notify_before, int) or notify_before <= 0:
                    errors.append("'notify_before' must be a positive integer")
            
            method = reminder_config.get('method')
            if method is not None:
                valid_methods = ['email', 'push', 'both']
                if method not in valid_methods:
                    errors.append(f"'method' must be one of {valid_methods}")
        
        return {
            "is_valid": len(errors) == 0,
            "errors": errors
        }

    @staticmethod
    def validate_recurrence_rule(recurrence_rule: Optional[Dict]) -> Dict[str, Any]:
        """Validate recurrence rule configuration."""
        if recurrence_rule is None or not recurrence_rule.get('enabled', False):
            return {"is_valid": True, "errors": []}
        
        errors = []
        
        if not isinstance(recurrence_rule, dict):
            return {
                "is_valid": False,
                "errors": ["Recurrence rule must be a dictionary"]
            }
        
        pattern = recurrence_rule.get('pattern')
        if pattern not in ['daily', 'weekly', 'monthly', 'interval']:
            errors.append("'pattern' must be one of: daily, weekly, monthly, interval")
        
        if pattern == 'interval':
            interval_days = recurrence_rule.get('interval_days')
            if interval_days is None or not isinstance(interval_days, int) or interval_days <= 0:
                errors.append("'interval_days' must be a positive integer when pattern is 'interval'")
        
        ends_on = recurrence_rule.get('ends_on')
        if ends_on and not isinstance(ends_on, datetime):
            errors.append("'ends_on' must be a valid datetime")
        
        occurrences_count = recurrence_rule.get('occurrences_count')
        if occurrences_count is not None and (not isinstance(occurrences_count, int) or occurrences_count <= 0):
            errors.append("'occurrences_count' must be a positive integer")
        
        return {
            "is_valid": len(errors) == 0,
            "errors": errors
        }

    @staticmethod
    def validate_task_fields(
        priority: Optional[str] = None,
        tags: Optional[List[str]] = None,
        due_date: Optional[datetime] = None,
        reminder_config: Optional[Dict] = None,
        recurrence_rule: Optional[Dict] = None
    ) -> Dict[str, Any]:
        """Validate all task fields and return comprehensive validation result."""
        results = {
            "priority": TaskValidator.validate_priority(priority) if priority else True,
            "tags": TaskValidator.validate_tags(tags) if tags is not None else {"is_valid": True, "errors": []},
            "due_date": TaskValidator.validate_due_date(due_date),
            "reminder_config": TaskValidator.validate_reminder_config(reminder_config),
            "recurrence_rule": TaskValidator.validate_recurrence_rule(recurrence_rule)
        }
        
        overall_valid = all([
            results["priority"] if isinstance(results["priority"], bool) else results["priority"]["is_valid"],
            results["tags"]["is_valid"],
            results["due_date"]["is_valid"],
            results["reminder_config"]["is_valid"],
            results["recurrence_rule"]["is_valid"]
        ])
        
        all_errors = []
        for field, result in results.items():
            if isinstance(result, dict) and "errors" in result:
                all_errors.extend([f"{field}: {error}" for error in result["errors"]])
        
        return {
            "is_valid": overall_valid,
            "errors": all_errors,
            "field_results": results
        }