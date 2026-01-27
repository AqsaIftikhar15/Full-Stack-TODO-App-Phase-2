"""
Agent orchestrator for coordinating agent interactions in the AI-powered Todo Chatbot.
This module coordinates the interaction between UserContextAgent, IntentParserAgent,
TodoManagerAgent, MCPInvokerAgent, and ConversationAgent.
"""

from typing import Dict, Any, Optional, List
from ..mcp_server.tools import add_task, list_tasks, update_task, complete_task, delete_task
from ..core.database import engine
from ..models.user import User
from sqlmodel import Session, select
import uuid


class AgentOrchestrator:
    """
    Orchestrates the interaction between different agents to process user messages
    and generate appropriate responses with task operations.
    """

    def __init__(self):
        """Initialize the agent orchestrator."""
        pass

    def process_user_message(self, user_id: str, message: str, conversation_history: Optional[List[Dict[str, Any]]] = None) -> Dict[str, Any]:
        """
        Process a user message through the agent pipeline.

        Args:
            user_id: The ID of the user sending the message
            message: The user's message
            conversation_history: Historical context for the conversation

        Returns:
            Dictionary containing the AI response and any tool calls executed
        """
        try:
            # Step 1: UserContextAgent - Validate user context
            user_context = self._validate_user_context(user_id)

            if not user_context:
                return {
                    "response": "I'm sorry, but I couldn't verify your user context. Please ensure you're properly authenticated.",
                    "tool_calls": [],
                    "error": "Invalid user context"
                }

            # Step 2: IntentParserAgent - Parse the user's intent
            intent_result = self._parse_intent(message, conversation_history)

            # Step 3: TodoManagerAgent - Handle the task-related action based on intent
            task_operations = self._handle_task_action(user_id, intent_result)

            # Step 4: MCPInvokerAgent - Execute the appropriate MCP tool calls
            tool_results = self._execute_tool_calls(user_id, intent_result, task_operations)

            # Step 5: ConversationAgent - Generate the final response
            response = self._generate_response(message, intent_result, tool_results)

            return {
                "response": response,
                "tool_calls": tool_results,
                "intent": intent_result.get("action", "unknown"),
                "processed_message": message
            }
        except Exception as e:
            # Handle any unexpected errors gracefully
            return {
                "response": "I'm sorry, but I encountered an issue processing your request. Please try again.",
                "tool_calls": [],
                "error": f"Processing error: {str(e)}"
            }

    def _validate_user_context(self, user_id: str) -> Optional[Dict[str, Any]]:
        """
        Validate that the user exists and has proper context.

        Args:
            user_id: The ID of the user to validate

        Returns:
            User context information if valid, None otherwise
        """
        try:
            # Validate UUID format
            user_uuid = uuid.UUID(user_id)

            # Verify the user exists in the database
            with Session(engine) as session:
                statement = select(User).where(User.id == user_uuid)
                user = session.exec(statement).first()

                if user is None:
                    # User does not exist in the database
                    return None

                return {"user_id": user_id, "valid": True}
        except ValueError:
            return None

    def _parse_intent(self, message: str, conversation_history: Optional[List[Dict[str, Any]]] = None) -> Dict[str, Any]:
        """
        Parse the user's intent from their message.

        Args:
            message: The user's message
            conversation_history: Historical context for the conversation

        Returns:
            Dictionary containing the parsed intent and extracted information
        """
        message_lower = message.lower().strip()

        # Enhanced intent detection with more natural language variations
        if any(keyword in message_lower for keyword in ['add', 'create', 'new', 'make']):
            action = "add_task"
        elif any(keyword in message_lower for keyword in [
            'list', 'show', 'display', 'view', 'my',
            'how many tasks', 'do i have', 'what tasks', 'on my list',
            "what's on my list", 'show my list', 'anything pending',
            'anything left', 'what have i', 'what tasks are'
        ]):
            action = "list_tasks"
        elif any(keyword in message_lower for keyword in ['update', 'change', 'modify', 'edit']):
            action = "update_task"
        elif any(keyword in message_lower for keyword in ['complete', 'done', 'finish', 'mark']):
            action = "complete_task"
        elif any(keyword in message_lower for keyword in ['delete', 'remove', 'cancel']):
            action = "delete_task"
        else:
            action = "unknown"

        # Extract task title if possible
        task_title = self._extract_task_title(message, action)

        return {
            "action": action,
            "task_title": task_title,
            "original_message": message,
            "confidence": 0.8  # Placeholder confidence score
        }

    def _handle_task_action(self, user_id: str, intent_result: Dict[str, Any]) -> Dict[str, Any]:
        """
        Handle the task-related action based on the parsed intent.

        Args:
            user_id: The ID of the user
            intent_result: The parsed intent from IntentParserAgent

        Returns:
            Dictionary containing task operation details
        """
        action = intent_result.get("action", "unknown")
        task_title = intent_result.get("task_title")

        if action == "add_task":
            # For add_task, we need a title
            if not task_title:
                return {
                    "operation": "request_clarification",
                    "message": "What would you like to add?",
                    "needs_input": True
                }

            # Extract potential description from the original message
            original_msg = intent_result['original_message']
            description = None

            # Look for "with description" pattern in the original message
            import re
            desc_pattern = r'(?:with\s+description\s+(.*)$|because\s+(.*)$)'
            match = re.search(desc_pattern, original_msg.lower())
            if match:
                # Take the first non-None group
                for group in match.groups():
                    if group:
                        description = group.strip()
                        break

            return {
                "operation": "add_task",
                "title": task_title,
                "description": description  # Only set to actual description, not command text
            }
        elif action == "list_tasks":
            return {
                "operation": "list_tasks",
                "filters": {}  # Could include filters based on message context
            }
        elif action == "update_task":
            # For update, first list tasks to identify which one to update
            return {
                "operation": "list_and_match",
                "action_type": "update",
                "target_title": task_title,
                "message": f"Which task would you like to update?{' Looking for: ' + task_title if task_title else ''}",
                "needs_input": task_title is None
            }
        elif action == "complete_task":
            # For complete, first list tasks to identify which one to complete
            return {
                "operation": "list_and_match",
                "action_type": "complete",
                "target_title": task_title,
                "message": f"Which task would you like to mark as complete?{' Looking for: ' + task_title if task_title else ''}",
                "needs_input": task_title is None
            }
        elif action == "delete_task":
            # For delete, first list tasks to identify which one to delete
            return {
                "operation": "list_and_match",
                "action_type": "delete",
                "target_title": task_title,
                "message": f"Which task would you like to delete?{' Looking for: ' + task_title if task_title else ''}",
                "needs_input": task_title is None
            }
        else:
            return {
                "operation": "unknown",
                "message": "I'm not sure how to help with that. You can ask me to add, list, update, complete, or delete tasks.",
                "needs_input": True
            }

    def _execute_tool_calls(self, user_id: str, intent_result: Dict[str, Any], task_operations: Dict[str, Any]) -> List[Dict[str, Any]]:
        """
        Execute the appropriate MCP tool calls based on the task operations.

        Args:
            user_id: The ID of the user
            intent_result: The parsed intent
            task_operations: The task operations to perform

        Returns:
            List of results from the executed tool calls
        """
        operation = task_operations.get("operation")
        results = []

        try:
            if operation == "add_task":
                title = task_operations.get("title", "Untitled task")
                description = task_operations.get("description", "")

                result = add_task(user_id, title, description)
                results.append({
                    "tool": "add_task",
                    "result": result,
                    "status": "success"
                })

            elif operation == "list_tasks":
                filters = task_operations.get("filters", {})
                result = list_tasks(user_id, filters)
                results.append({
                    "tool": "list_tasks",
                    "result": result,
                    "status": "success"
                })

            elif operation == "list_and_match":
                # First list all tasks to identify which one to operate on
                action_type = task_operations.get("action_type")
                target_title = task_operations.get("target_title")

                # Get all tasks for the user
                all_tasks = list_tasks(user_id, {})

                # Handle pronouns and natural language references like "it", "that", "the task"
                # If the user said something like "complete it" or "delete that",
                # and there's only one task, use that task
                if not target_title and len(all_tasks) == 1:
                    # User likely refers to the only task
                    target_title = all_tasks[0].get('title', '')

                # Find matching task(s)
                if target_title:
                    # Look for exact or partial matches
                    matching_tasks = []
                    for task in all_tasks:
                        task_title = task.get('title', '')
                        if target_title.lower() in task_title.lower() or task_title.lower() in target_title.lower():
                            matching_tasks.append(task)
                else:
                    matching_tasks = all_tasks

                if len(matching_tasks) == 1:
                    # Exactly one task matches, proceed with the action
                    target_task = matching_tasks[0]
                    task_id = target_task.get('id')

                    if action_type == "complete":
                        result = complete_task(user_id, task_id)
                        results.append({
                            "tool": "complete_task",
                            "result": result,
                            "status": "success"
                        })
                    elif action_type == "delete":
                        result = delete_task(user_id, task_id)
                        results.append({
                            "tool": "delete_task",
                            "result": result,
                            "status": "success"
                        })
                    elif action_type == "update":
                        # For update, we need more details, so return the task info
                        results.append({
                            "tool": "task_found_for_update",
                            "result": target_task,
                            "status": "success"
                        })
                elif len(matching_tasks) == 0:
                    # No matching tasks found
                    results.append({
                        "tool": "conversation",
                        "result": "No matching tasks found.",
                        "status": "request_info"
                    })
                elif len(all_tasks) == 1 and not target_title:
                    # Only one task exists and user didn't specify which one
                    # Auto-select the only task (handle natural language references like "it", "that task", "the task")
                    target_task = all_tasks[0]
                    task_id = target_task.get('id')

                    if action_type == "complete":
                        result = complete_task(user_id, task_id)
                        results.append({
                            "tool": "complete_task",
                            "result": result,
                            "status": "success"
                        })
                    elif action_type == "delete":
                        result = delete_task(user_id, task_id)
                        results.append({
                            "tool": "delete_task",
                            "result": result,
                            "status": "success"
                        })
                    elif action_type == "update":
                        # For update, we need more details, so return the task info
                        results.append({
                            "tool": "task_found_for_update",
                            "result": target_task,
                            "status": "success"
                        })
                else:
                    # Multiple tasks match, need clarification
                    results.append({
                        "tool": "conversation",
                        "result": task_operations.get("message", "Which task would you like to operate on?"),
                        "status": "request_info"
                    })

            elif operation == "request_clarification" or operation == "request_details" or operation == "request_identification":
                # These operations don't execute tools but return a clarification message
                results.append({
                    "tool": "conversation",
                    "result": task_operations.get("message", "I need more information to help you."),
                    "status": "request_info"
                })

            elif operation == "unknown":
                results.append({
                    "tool": "conversation",
                    "result": task_operations.get("message", "I'm not sure how to help with that."),
                    "status": "unknown_action"
                })

        except Exception as e:
            results.append({
                "tool": operation,
                "result": str(e),
                "status": "error"
            })

        return results

    def _generate_response(self, original_message: str, intent_result: Dict[str, Any], tool_results: List[Dict[str, Any]]) -> str:
        """
        Generate the final response to the user based on the intent and tool results.

        Args:
            original_message: The user's original message
            intent_result: The parsed intent
            tool_results: Results from executed tool calls

        Returns:
            The AI-generated response to the user
        """
        if not tool_results:
            return "I processed your request, but there were no actions taken."

        # Find successful task operation results
        success_results = [r for r in tool_results if r.get("status") == "success"]
        error_results = [r for r in tool_results if r.get("status") == "error"]
        request_results = [r for r in tool_results if r.get("status") in ["request_info", "unknown_action"]]

        if request_results:
            # If we need more info, return the clarification message
            return request_results[0]["result"]
        elif error_results:
            # If there were errors, return an error message
            return f"I encountered an error processing your request: {error_results[0]['result']}"
        elif success_results:
            # Generate response based on the successful operation
            tool_used = success_results[0]["tool"]
            result_data = success_results[0]["result"]

            if tool_used == "add_task":
                task_title = result_data.get('title', 'unnamed task')
                return f"Added. '{task_title}' is now on your list."
            elif tool_used == "list_tasks":
                task_count = len(result_data) if isinstance(result_data, list) else 0
                if task_count == 0:
                    return "You don't have any tasks on your list."
                elif task_count == 1:
                    # Format the single task properly with count and summary
                    task = result_data[0]
                    title = task.get('title', 'Unnamed task')
                    status = "Completed" if task.get('is_completed', False) else "Pending"

                    return f"You currently have 1 task:\n- {title} ({status})"
                else:
                    # Format multiple tasks in a clean list with count
                    task_list = []
                    for task in result_data:
                        title = task.get('title', 'Unnamed task')
                        status = "Completed" if task.get('is_completed', False) else "Pending"
                        task_list.append(f"- {title} ({status})")

                    tasks_str = "\n".join(task_list)
                    return f"You currently have {task_count} tasks:\n{tasks_str}"
            elif tool_used == "complete_task":
                # Return success message for completion using natural language
                task_title = result_data.get('title', 'task') if isinstance(result_data, dict) else 'the task'
                return f"Done. '{task_title}' is now completed."
            elif tool_used == "delete_task":
                # Return success message for deletion using natural language
                task_title = result_data.get('title', 'task') if isinstance(result_data, dict) else 'the task'
                return f"Deleted. '{task_title}' has been removed from your list."
            elif tool_used == "task_found_for_update":
                # For update operations, return the task info
                task_title = result_data.get('title', 'task')
                return f"What would you like to update about '{task_title}'? Please provide the new title or description."
            else:
                return f"I've processed your request successfully."
        else:
            return "I processed your request, but there were no actions taken."

    def _extract_task_title(self, message: str, action: str) -> Optional[str]:
        """
        Extract a potential task title from the user's message.

        Args:
            message: The user's message
            action: The action being performed

        Returns:
            Extracted task title or None if not found
        """
        if action != "add_task":
            return None

        import re

        # Simple extraction logic - look for the first noun phrase after action keywords
        message_lower = message.lower()

        # Handle "add a task named [title] with description [desc]" pattern
        named_pattern = r'(?:add|create)\s+(?:a\s+)?task\s+named\s+(.+?)(?:\s+with\s+description\s+.*)?$'
        match = re.search(named_pattern, message_lower)
        if match:
            # Extract just the title part before "with description"
            title_part = match.group(1).strip()
            # Further split on "with description" if it exists in the extracted title
            if ' with description ' in title_part:
                title_part = title_part.split(' with description ')[0].strip()
            return title_part

        # Remove common action phrases
        for phrase in ['add a task to ', 'add task to ', 'create a task to ', 'create task to ', 'add ', 'create ']:
            if message_lower.startswith(phrase):
                extracted = message[len(phrase):].strip()
                # If the extracted part contains "with description", split it
                if ' with description ' in extracted.lower():
                    title_part = extracted.split(' with description ', 1)[0].strip()
                    return title_part
                return extracted

        # Look for "to" as separator for action phrases
        if ' to ' in message_lower:
            parts = message.split(' to ', 1)
            if len(parts) > 1:
                extracted = parts[1].strip()
                # If the extracted part contains "with description", split it
                if ' with description ' in extracted.lower():
                    title_part = extracted.split(' with description ', 1)[0].strip()
                    return title_part
                return extracted

        # If nothing else worked, return the whole message as a potential task
        # But first check if it contains "with description" and extract just the title part
        if ' with description ' in message_lower:
            title_part = message.split(' with description ', 1)[0].strip()
            # Remove common prefixes that might still be there
            prefixes_to_remove = ['a task named ', 'task named ']
            for prefix in prefixes_to_remove:
                if title_part.lower().startswith(prefix):
                    title_part = title_part[len(prefix):].strip()
                    break
            return title_part

        if message.strip():
            return message.strip()

        return None


# Global orchestrator instance
orchestrator = AgentOrchestrator()