'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '../hooks/useAuth';
import { useTasks } from '../hooks/useTasks';
import { Task } from '../lib/types';
import Navbar from '../components/ui/Navbar';
import TaskForm from '../components/ui/TaskForm';
import TaskList from '../components/ui/TaskList';

export default function HomePage() {
  const { user, loading: authLoading, isAuthenticated } = useAuth();

  // For non-authenticated users, maintain temporary tasks in local state
  const [tempTasks, setTempTasks] = useState<Task[]>([]);
  const [tempLoading, setTempLoading] = useState(false);

  // For authenticated users, use the API tasks
  const { tasks: apiTasks, loading: apiTasksLoading, error: apiError, createTask, updateTask, toggleTaskCompletion, deleteTask } = useTasks();

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

  // For non-authenticated users, use temp tasks; for authenticated users, use API tasks
  const displayTasks = isAuthenticated ? apiTasks : tempTasks;
  const displayLoading = isAuthenticated ? apiTasksLoading : tempLoading;

  return (
    <div className="min-h-screen bg-gradient-to-br from-bluish-50 to-purplish-50">
      <Navbar />

      {/* Main Content */}
      <main className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl font-bold text-gray-800 mb-6">AquaTodo</h1>
          <p className="text-xl text-gray-600 mb-12 max-w-2xl mx-auto">
            A simple, responsive, and visually appealing Todo application that helps you organize and manage your tasks efficiently.
          </p>

          {/* Features Section */}
          <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-6 mb-12">
            <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
              <div className="text-2xl mb-3">➕</div>
              <h3 className="font-semibold text-gray-800 mb-2">Add Tasks</h3>
              <p className="text-gray-600 text-sm">Create new tasks with titles and descriptions</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
              <div className="text-2xl mb-3">👁️</div>
              <h3 className="font-semibold text-gray-800 mb-2">View Tasks</h3>
              <p className="text-gray-600 text-sm">See all your tasks in an organized list</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
              <div className="text-2xl mb-3">✏️</div>
              <h3 className="font-semibold text-gray-800 mb-2">Update Tasks</h3>
              <p className="text-gray-600 text-sm">Edit task details anytime you need</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
              <div className="text-2xl mb-3">🗑️</div>
              <h3 className="font-semibold text-gray-800 mb-2">Delete Tasks</h3>
              <p className="text-gray-600 text-sm">Remove tasks you no longer need</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
              <div className="text-2xl mb-3">✅</div>
              <h3 className="font-semibold text-gray-800 mb-2">Mark Complete</h3>
              <p className="text-gray-600 text-sm">Toggle task completion status</p>
            </div>
          </div>

          {/* Task Management Dashboard */}
          <div className="bg-white rounded-2xl shadow-xl p-6 mb-8 max-w-2xl mx-auto">
            <h2 className="text-2xl font-bold text-gray-800 mb-2 text-center">
              {isAuthenticated ? `Hello, ${user?.name || user?.email}!` : 'AquaTodo Dashboard'}
            </h2>
            <p className="text-gray-600 mb-4 text-center">
              {isAuthenticated
                ? 'Here are your tasks'
                : 'Manage your tasks - Login to save your tasks permanently'
              }
            </p>

            {!isAuthenticated && (
              <div className="bg-yellow-50 border border-yellow-200 text-yellow-700 px-4 py-3 rounded-lg mb-4 text-center">
                <p className="font-medium">Login to save tasks permanently.</p>
              </div>
            )}

            <TaskForm onCreateTask={currentCreateTask} />

            <div className="mt-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-3">Your Tasks</h3>
              <TaskList
                tasks={displayTasks}
                loading={displayLoading}
                error={isAuthenticated ? apiError : null}
                onUpdateTask={currentUpdateTask}
                onToggleTask={currentToggleTask}
                onDeleteTask={currentDeleteTask}
              />
            </div>
          </div>

          <p className="text-gray-600 text-sm mt-4">
            Start managing your tasks today - no signup required to try it out!
          </p>
        </div>
      </main>
    </div>
  );
}