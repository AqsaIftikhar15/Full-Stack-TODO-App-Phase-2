'use client';

import React, { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { useTasks } from '../../hooks/useTasks';
import { Task } from '../../lib/types';
import Navbar from '../../components/ui/Navbar';
import TaskForm from '../../components/ui/TaskForm';
import TaskList from '../../components/ui/TaskList';
import Loader from '../../components/ui/Loader';

const TasksPage: React.FC = () => {
  const { user, loading: authLoading, isAuthenticated } = useAuth();
  const { tasks, loading: tasksLoading, error, createTask, updateTask, toggleTaskCompletion, deleteTask } = useTasks();

  // For non-authenticated users, maintain temporary tasks in local state
  const [tempTasks, setTempTasks] = useState<Task[]>([]);
  const [tempLoading, setTempLoading] = useState(false);

  // Determine which tasks to display based on authentication status
  const displayTasks = isAuthenticated ? tasks : tempTasks;
  const displayLoading = isAuthenticated ? tasksLoading : tempLoading;

  // Handle temporary tasks for non-authenticated users
  const handleCreateTempTask = (title: string, description?: string) => {
    const newTask: Task = {
      id: Date.now().toString(),
      title,
      description: description || '',
      completed: false,
      userId: 'guest',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setTempTasks(prev => [...prev, newTask]);
  };

  const handleUpdateTempTask = (id: string, title: string, description?: string) => {
    setTempTasks(prev =>
      prev.map(task =>
        task.id === id
          ? { ...task, title, description: description || task.description, updatedAt: new Date().toISOString() }
          : task
      )
    );
  };

  const handleToggleTempTask = (id: string) => {
    setTempTasks(prev =>
      prev.map(task =>
        task.id === id
          ? { ...task, completed: !task.completed, updatedAt: new Date().toISOString() }
          : task
      )
    );
  };

  const handleDeleteTempTask = (id: string) => {
    setTempTasks(prev => prev.filter(task => task.id !== id));
  };

  // Determine which functions to use based on authentication status
  const currentCreateTask = isAuthenticated ? createTask : handleCreateTempTask;
  const currentUpdateTask = isAuthenticated ? updateTask : handleUpdateTempTask;
  const currentToggleTask = isAuthenticated ? toggleTaskCompletion : handleToggleTempTask;
  const currentDeleteTask = isAuthenticated ? deleteTask : handleDeleteTempTask;

  if (authLoading) {
    return <Loader text="Loading..." />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-bluish-50 to-purplish-50">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-3xl font-bold text-center text-gray-800 mb-2">
            {isAuthenticated ? `Hello, ${user?.name || user?.email}!` : 'AquaTodo'}
          </h1>
          <p className="text-center text-gray-600 mb-4">
            {isAuthenticated
              ? 'Here are your tasks'
              : 'Manage your tasks - Login to save your tasks permanently'
            }
          </p>

          {!isAuthenticated && (
            <div className="bg-yellow-50 border border-yellow-200 text-yellow-700 px-4 py-3 rounded-lg mb-6 text-center">
              <p className="font-medium">Note: Your tasks are temporary and will be lost when you refresh the page.</p>
              <p className="mt-1">Login to save your tasks permanently.</p>
            </div>
          )}

          <TaskForm onCreateTask={currentCreateTask} />

          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Your Tasks</h2>
            <TaskList
              tasks={displayTasks}
              loading={displayLoading}
              error={error}
              onUpdateTask={currentUpdateTask}
              onToggleTask={currentToggleTask}
              onDeleteTask={currentDeleteTask}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default TasksPage;