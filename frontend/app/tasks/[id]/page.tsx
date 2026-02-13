'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '../../../hooks/useAuth';
import { useTasks } from '../../../hooks/useTasks';
import { Task } from '../../../lib/types';
import Navbar from '../../../components/ui/Navbar';
import TaskForm from '../../../components/ui/TaskForm';
import ActivityTimeline from '../../../components/ui/ActivityTimeline';
import ActivityExport from '../../../components/ui/ActivityExport';
import Loader from '../../../components/ui/Loader';

const TaskDetailPage: React.FC = () => {
  const { id: taskId } = useParams();
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  const { tasks, loading: tasksLoading, getActivityLog, updateTask, completeTask, archiveTask, deleteTask } = useTasks();
  const [task, setTask] = useState<Task | null>(null);
  const [activityLog, setActivityLog] = useState<any[]>([]);
  const [activityLoading, setActivityLoading] = useState(true);
  const [showEditForm, setShowEditForm] = useState(false);

  useEffect(() => {
    if (taskId && tasks.length > 0) {
      const foundTask = tasks.find(t => t.id === taskId);
      if (foundTask) {
        setTask(foundTask);
      }
    }
  }, [taskId, tasks]);

  useEffect(() => {
    const fetchActivityLog = async () => {
      if (taskId && isAuthenticated) {
        try {
          setActivityLoading(true);
          const log = await getActivityLog(taskId as string);
          setActivityLog(log.activities || []);
        } catch (error) {
          console.error('Error fetching activity log:', error);
        } finally {
          setActivityLoading(false);
        }
      }
    };

    fetchActivityLog();
  }, [taskId, isAuthenticated, getActivityLog]);

  // If we don't have the task in the cached tasks, fetch it individually
  useEffect(() => {
    if (taskId && tasks.length === 0 && isAuthenticated) {
      // We need to fetch the task individually since it's not in the cached list
      // This would require a new API endpoint or we can use the existing getTasks and filter
      // For now, we'll rely on the global tasks list being loaded
    }
  }, [taskId, tasks, isAuthenticated]);

  const handleUpdateTask = async (
    title?: string,
    description?: string,
    priority?: 'low' | 'medium' | 'high',
    tags?: string[],
    dueDate?: string | Date,
    reminderConfig?: { enabled: boolean; notifyBefore: number; method: 'email' | 'push' | 'both' },
    recurrenceRule?: { enabled: boolean; pattern: 'daily' | 'weekly' | 'monthly' | 'interval'; intervalDays?: number; endsOn?: string | Date; occurrencesCount?: number },
    status?: 'pending' | 'completed' | 'archived'
  ) => {
    if (!task) return;

    await updateTask(
      task.id,
      title,
      description,
      priority,
      tags,
      dueDate,
      reminderConfig,
      recurrenceRule,
      status
    );

    // Refresh the task by fetching it again
    const updatedTasks = tasks.map(t => 
      t.id === task.id 
        ? { ...t, title: title || t.title, description: description || t.description, priority: priority || t.priority, tags: tags || t.tags, dueDate: dueDate || t.dueDate, reminderConfig: reminderConfig || t.reminderConfig, recurrenceRule: recurrenceRule || t.recurrenceRule, status: status || t.status } 
        : t
    );
    
    setTask(updatedTasks.find(t => t.id === task.id) || null);
    setShowEditForm(false);
  };

  const handleCompleteTask = async () => {
    if (!task) return;
    await completeTask(task.id);
    // Refresh the page to update the task
    window.location.reload();
  };

  const handleArchiveTask = async () => {
    if (!task) return;
    await archiveTask(task.id);
    // Refresh the page to update the task
    window.location.reload();
  };

  const handleDeleteTask = async () => {
    if (!task) return;
    if (window.confirm('Are you sure you want to delete this task?')) {
      await deleteTask(task.id);
      router.push('/tasks'); // Redirect to tasks list after deletion
    }
  };

  if (tasksLoading || (taskId && !task && tasks.length > 0)) {
    return <Loader text="Loading task..." />;
  }

  if (!task) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-bluish-50 to-purplish-50">
        <Navbar />
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-3xl font-bold text-gray-800 mb-6">Task Not Found</h1>
            <p className="text-gray-600 mb-4">The task you're looking for doesn't exist or you don't have permission to view it.</p>
            <button 
              onClick={() => router.push('/tasks')}
              className="px-4 py-2 bg-bluish-500 text-white rounded hover:bg-bluish-600 transition"
            >
              Back to Tasks
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-bluish-50 to-purplish-50">
      <Navbar />
      
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold text-gray-800">Task Details</h1>
            <button 
              onClick={() => router.back()}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition"
            >
              Back
            </button>
          </div>

          {/* Task Card */}
          <div className="bg-white rounded-lg shadow p-6 mb-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h2 className={`text-2xl font-bold ${task.completed ? 'line-through text-gray-500' : 'text-gray-800'}`}>
                  {task.title}
                </h2>
                
                {/* Priority indicator */}
                {task.priority && (
                  <span className={`inline-block px-3 py-1 rounded-full text-sm mt-2 ${
                    task.priority === 'high' ? 'bg-red-100 text-red-800' :
                    task.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-green-100 text-green-800'
                  }`}>
                    {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)} Priority
                  </span>
                )}
              </div>
              
              <div className="flex space-x-2">
                <button
                  onClick={() => setShowEditForm(!showEditForm)}
                  className="px-3 py-1 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition text-sm"
                >
                  {showEditForm ? 'Cancel' : 'Edit'}
                </button>
                <button
                  onClick={handleDeleteTask}
                  className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition text-sm"
                >
                  Delete
                </button>
              </div>
            </div>

            {task.description && (
              <p className={`mt-2 ${task.completed ? 'line-through text-gray-500' : 'text-gray-600'}`}>
                {task.description}
              </p>
            )}

            {/* Tags display */}
            {task.tags && task.tags.length > 0 && (
              <div className="mt-4">
                <h3 className="text-sm font-medium text-gray-700 mb-1">Tags:</h3>
                <div className="flex flex-wrap gap-2">
                  {task.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="inline-block px-3 py-1 text-sm rounded-full bg-blue-100 text-blue-800"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Due date display */}
            {task.dueDate && (
              <div className="mt-4">
                <h3 className="text-sm font-medium text-gray-700 mb-1">Due Date:</h3>
                <p className="text-gray-600">
                  {new Date(task.dueDate).toLocaleDateString()} at {new Date(task.dueDate).toLocaleTimeString()}
                </p>
              </div>
            )}

            {/* Reminder configuration */}
            {task.reminderConfig && task.reminderConfig.enabled && (
              <div className="mt-4">
                <h3 className="text-sm font-medium text-gray-700 mb-1">Reminder:</h3>
                <p className="text-gray-600">
                  Enabled: {task.reminderConfig.notifyBefore} minutes before due date via {task.reminderConfig.method}
                </p>
              </div>
            )}

            {/* Recurrence configuration */}
            {task.recurrenceRule && task.recurrenceRule.enabled && (
              <div className="mt-4">
                <h3 className="text-sm font-medium text-gray-700 mb-1">Recurrence:</h3>
                <p className="text-gray-600">
                  Pattern: {task.recurrenceRule.pattern}{task.recurrenceRule.intervalDays ? `, Interval: ${task.recurrenceRule.intervalDays} days` : ''}
                  {task.recurrenceRule.occurrencesCount ? `, Max Occurrences: ${task.recurrenceRule.occurrencesCount}` : ''}
                  {task.recurrenceRule.endsOn ? `, Ends on: ${new Date(task.recurrenceRule.endsOn).toLocaleDateString()}` : ''}
                </p>
              </div>
            )}

            {/* Status display */}
            <div className="mt-4">
              <h3 className="text-sm font-medium text-gray-700 mb-1">Status:</h3>
              <p className="text-gray-600 capitalize">{task.status}</p>
            </div>

            {/* Created/Updated dates */}
            <div className="mt-4 grid grid-cols-2 gap-4">
              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-1">Created:</h3>
                <p className="text-gray-600">{new Date(task.createdAt).toLocaleString()}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-1">Last Updated:</h3>
                <p className="text-gray-600">{new Date(task.updatedAt).toLocaleString()}</p>
              </div>
            </div>

            {/* Action buttons */}
            <div className="mt-6 flex flex-wrap gap-2">
              {task.status !== 'completed' && task.status !== 'archived' && (
                <button
                  onClick={handleCompleteTask}
                  className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition"
                >
                  Mark as Complete
                </button>
              )}
              
              {task.status === 'completed' && (
                <button
                  onClick={handleArchiveTask}
                  className="px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600 transition"
                >
                  Archive Task
                </button>
              )}
            </div>
          </div>

          {/* Edit Form */}
          {showEditForm && (
            <div className="bg-white rounded-lg shadow p-6 mb-6">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">Edit Task</h3>
              <TaskForm 
                onCreateTask={(
                  title: string,
                  description?: string,
                  priority?: 'low' | 'medium' | 'high',
                  tags?: string[],
                  dueDate?: string | Date,
                  reminderConfig?: { enabled: boolean; notifyBefore: number; method: 'email' | 'push' | 'both' },
                  recurrenceRule?: { enabled: boolean; pattern: 'daily' | 'weekly' | 'monthly' | 'interval'; intervalDays?: number; endsOn?: string | Date; occurrencesCount?: number }
                ) => handleUpdateTask(title, description, priority, tags, dueDate, reminderConfig, recurrenceRule)}
              />
            </div>
          )}

          {/* Activity Timeline */}
          <div className="mb-6">
            {activityLoading ? (
              <Loader text="Loading activity log..." />
            ) : (
              <>
                <ActivityTimeline activities={activityLog} />
                <ActivityExport activities={activityLog} taskId={task.id} />
              </>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default TaskDetailPage;